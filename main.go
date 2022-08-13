package main

import (
	"embed"
	"fmt"
	"log"
	"os"
	"os/exec"
	"syscall"

	"github.com/robfig/cron/v3"
	"github.com/shirou/gopsutil/process"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	Setup()
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Cronos",
		Width:     1220,
		Height:    720,
		Assets:    assets,
		OnStartup: app.startup,
		Bind: []interface{}{
			app,
			&AppData{},
		},
	})

	if err != nil {
		println("Error:", err)
	}
}

type AppData struct {
	gorm.Model
	Id         int64
	Name       string
	Path       string
	Executable string
	Time       int64
	Running    bool
}

var (
	// DB The database connection
	db *gorm.DB
)

// Setup connection to database
func Setup() {
	//CONNECTION
	dbCon, err := gorm.Open(sqlite.Open("cronos.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	dbCon.AutoMigrate(&AppData{})

	// defer dbCon.Close()
	db = dbCon
	fmt.Println("CONNECTED")

	//Sets all collumn running to false
	dbCon.Model(&AppData{}).Where("id > 0 AND running = ?", true).Update("running", false)
}

func (a *App) Create(name string, path string, executable string, time int64) {
	// Create
	db.Create(&AppData{Name: name, Path: path, Executable: executable, Time: time, Running: false})
}

func (a *App) Update(id int64, name string, path string, executable string) {
	// Update
	db.Model(&AppData{}).Omit("updated_at").Where("id = ?", id).UpdateColumns(AppData{Name: name, Path: path, Executable: executable})
}

func (a *App) DeleteApp(id int64) {
	// Delete
	var appData AppData
	db.Delete(&appData, id)
}

func createBatFile(executable string, path string) {
	f, err := os.Create("cronos.bat")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	_, err2 := f.WriteString(`start /d "` + path + `" ` + executable + ``)

	if err2 != nil {
		log.Fatal(err2)
	}

	fmt.Println("done")
}

func (a *App) Play(name string, path string) {
	fmt.Println(path, name)

	createBatFile(name, path)

	appToRun := exec.Command("cmd", "/c", "cronos.bat")
	appToRun.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	appToRunOut, err := appToRun.Output()
	if err != nil {
		os.Stderr.WriteString(err.Error())
	}
	fmt.Println(string(appToRunOut))
}

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}

func (a *App) CheckRunningProcess(name string, id int64) {
	// fmt.Println(name)

	// Sets running to true
	db.Model(&AppData{}).Where("id = ?", id).Update("running", true)

	c := cron.New(cron.WithParser(cron.NewParser(cron.SecondOptional | cron.Minute | cron.Hour | cron.Dom | cron.Month | cron.Dow)))

	c.AddFunc("*/60 * * * * *", func() {
		var processRunning []string
		fmt.Println("Running")
		processes, err := process.Processes()

		if err != nil {
			// return err
			fmt.Println(err)
		}

		for _, p := range processes {
			n, err := p.Name()

			if err != nil {
				// return
				fmt.Println(err)
				// processRunning = processRunning[:0]
				// fmt.Println(processRunning)
			}
			processRunning = append(processRunning, n)
		}

		if contains(processRunning, name) {
			// fmt.Println("ok")
			// Read
			var appData AppData
			db.Find(&appData, id)
			timing := appData.Time
			db.Model(&AppData{}).Where("id = ?", id).Update("time", timing+60)
			db.Model(&AppData{}).Where("id = ?", id).Update("running", true)
			timing = 0
			// fmt.Println(p.Name())
			// fmt.Println("FOUND")
			// fmt.Println(secondsToMinutes(time))
			// fmt.Println(time)

			// return p.Kill()
		} else {
			// fmt.Println("false")
			db.Model(&AppData{}).Omit("updated_at").Where("id = ?", id).Update("running", false)

			// Stop the cron job when playing again
			c.Stop()
		}

	})
	fmt.Println("CRON JOB STARTED")
	c.Start()
	select {}
}

func (a *App) FindAll() []AppData {
	// Read
	var appData []AppData
	db.Order("updated_at desc").Find(&appData)
	return appData
}

func (a *App) FindTotalTimePlayed() int64 {
	var total int64
	db.Table("app_data").Select("SUM(time)").Where("deleted_at IS NULL").Row().Scan(&total)
	return total
}

type MosPlayedGame struct {
	Name  string
	Total int64
}

func (a *App) FindMostPlayedGame() MosPlayedGame {
	var mostPlayedGame MosPlayedGame
	db.Table("app_data").Select("name, MAX(time) AS total").Where("deleted_at IS NULL").Find(&mostPlayedGame)
	return mostPlayedGame
}

func (a *App) FindTotalTimePlayedLastWeek(today string, lastWeek string) int64 {
	var total int64
	db.Table("app_data").Select("SUM(time)").Where("created_at >= ? AND created_at <= ?", lastWeek, today).Row().Scan(&total)
	return total
}

func (a *App) FindTotalTimePlayedLastMonth(today string, lastMonth string) int64 {
	var total int64
	db.Table("app_data").Select("SUM(time)").Where("created_at >= ? AND created_at <= ?", lastMonth, today).Row().Scan(&total)
	return total
}

func (a *App) FindTotalGamesPlayedLastWeek(today string, lastWeek string) []AppData {
	var appData []AppData
	db.Order("updated_at desc").Where("updated_at >= ? AND updated_at <= ?", lastWeek, today).Find(&appData)
	return appData
}

func (a *App) GameExePath() string {
	selection, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title:           "Search game EXE",
		ShowHiddenFiles: false,
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Executable (*.exe)",
				Pattern:     "*.exe",
			},
		},
	})

	if err != nil {
		fmt.Println(err)
	}
	return selection
}
