package main

import (
	"database/sql"
	"embed"
	"fmt"
	"log"
	"os"
	"os/exec"
	"syscall"
	"time"

	"github.com/robfig/cron/v3"

	"github.com/saturnavt/howlongtobeat"
	"github.com/shirou/gopsutil/process"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	models "cronos/models"
	utils "cronos/utils"

	pcs "github.com/saturnavt/pcspecs"
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
			&models.AppData{},
		},
	})

	if err != nil {
		println("Error:", err)
	}
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
	dbCon.AutoMigrate(&models.AppData{}, &models.GameHistorical{})

	// defer dbCon.Close()
	db = dbCon
	fmt.Println("CONNECTED")

	//Sets all collumn running to false
	dbCon.Model(&models.AppData{}).Where("id > 0 AND running = ?", true).Update("running", false)
}

func (a *App) Create(image string, name string, path string, executable string, time int64) {
	// Create
	db.Create(&models.AppData{Image: image, Name: name, Path: path, Executable: executable, Time: time, Running: false})
}

func (a *App) Update(id int64, name string, path string, executable string) {
	// Update
	db.Model(&models.AppData{}).Omit("updated_at").Where("id = ?", id).UpdateColumns(models.AppData{Name: name, Path: path, Executable: executable})
}

func (a *App) DeleteApp(id int64) {
	// Delete
	var appData models.AppData
	db.Delete(&appData, id)
}

func createBatFile(executable string, path string) {
	f, err := os.Create("cronos_runner.bat")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	// _, err2 := f.WriteString(`start "" "` + path + executable + `"`)//this causes and error becouse it dosnt recognizes de white spaces in exe
	_, err2 := f.WriteString(`start /d "` + path + `" ` + executable + ``)

	if err2 != nil {
		log.Fatal(err2)
	}

	fmt.Println("done")
}

func (a *App) Play(name string, path string) {
	fmt.Println(path, name)

	createBatFile(name, path)

	// appToRun := exec.Command(path + name)
	appToRun := exec.Command("cmd", "/c", "cronos_runner.bat")
	appToRun.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	appToRunOut, err := appToRun.Output()
	if err != nil {
		os.Stderr.WriteString(err.Error())
	}
	fmt.Println(string(appToRunOut))
}

func (a *App) CheckRunningProcess(name string, id int64, today string, tomorrow string) {
	// fmt.Println(name)

	// Sets running to true
	db.Model(&models.AppData{}).Where("id = ?", id).Update("running", true)

	// Insert into historical if dosn't exist
	var gameHistorical []models.GameHistorical
	db.Where("game_id = ? AND created_at >= ? AND created_at < ?", id, today, tomorrow).Find(&gameHistorical)

	if len(gameHistorical) <= 0 {
		db.Create(&models.GameHistorical{GameId: id, Time: 0})
	}

	c := cron.New(cron.WithParser(cron.NewParser(cron.SecondOptional | cron.Minute | cron.Hour | cron.Dom | cron.Month | cron.Dow)))

	time.Sleep(60 * time.Second)

	c.AddFunc("*/30 * * * * *", func() {
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

		if utils.Contains(processRunning, name) {
			// fmt.Println("ok")
			// Read
			var appData models.AppData
			db.Find(&appData, id)
			timing := appData.Time
			db.Model(&models.AppData{}).Where("id = ?", id).Update("time", timing+30)
			db.Model(&models.AppData{}).Where("id = ?", id).Update("running", true)
			timing = 0

			// updates time historical by created_at
			var gameHistorical models.GameHistorical
			db.Where("game_id = ? AND created_at >= ? AND created_at < ?", id, today, tomorrow).Find(&gameHistorical)
			gameTiming := gameHistorical.Time

			db.Model(&models.GameHistorical{}).Where("id = ?", gameHistorical.Id).Update("time", gameTiming+30)
			gameTiming = 0

			// fmt.Println(p.Name())
			// fmt.Println("FOUND")
			// fmt.Println(secondsToMinutes(time))
			// fmt.Println(time)

			// return p.Kill()
		} else {
			// fmt.Println("false")
			db.Model(&models.AppData{}).Omit("updated_at").Where("id = ?", id).Update("running", false)

			// Stop the cron job when playing again
			c.Stop()
		}

	})
	fmt.Println("CRON JOB STARTED")
	c.Start()
	select {}
}

func (a *App) FindAll() []models.AppData {
	// Read
	var appData []models.AppData
	db.Order("updated_at desc").Find(&appData)
	return appData
}

func (a *App) FindOne(gameId int64) models.AppData {
	// Read
	var appData models.AppData
	db.Where("id = ?", gameId).Find(&appData)
	return appData
}

func (a *App) FindTotalTimePlayed() int64 {
	var total int64
	db.Table("game_historicals").Select("SUM(time)").Row().Scan(&total)
	return total
}

func (a *App) FindMostPlayedGame() models.MosPlayedGame {
	var mostPlayedGame models.MosPlayedGame
	db.Table("app_data").Select("name, MAX(time) AS total").Where("deleted_at IS NULL").Find(&mostPlayedGame)
	return mostPlayedGame
}

func (a *App) FindTotalTimePlayedGameToday(today string, tomorrow string, id []int64) []int64 {
	var totalPlayedToday []int64

	var total int64
	for i := 0; i < len(id); i++ {
		total = 0 // resets total for each loop
		db.Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ? AND game_id = ?", today, tomorrow, id[i]).Row().Scan(&total)
		totalPlayedToday = append(totalPlayedToday, total)
	}

	return totalPlayedToday
}

func (a *App) FindTotalTimePlayedGameThisWeek(today string, lastWeek string, id []int64) []int64 {
	var totalPlayedThisWeek []int64

	var total int64
	for i := 0; i < len(id); i++ {
		total = 0 // resets total for each loop
		db.Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ? AND game_id = ?", lastWeek, today, id[i]).Row().Scan(&total)
		totalPlayedThisWeek = append(totalPlayedThisWeek, total)
	}

	return totalPlayedThisWeek
}

func (a *App) FindTotalTimePlayedLastWeek(today string, lastWeek string) int64 {
	var total int64
	db.Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ?", lastWeek, today).Row().Scan(&total)
	return total
}

func (a *App) FindTotalTimePlayedToday(today string, tomorrow string) int64 {
	var total int64
	db.Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ?", today, tomorrow).Row().Scan(&total)
	return total
}

func (a *App) FindTotalTimePlayedLastMonth(today string, lastMonth string) int64 {
	var total int64
	db.Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ?", lastMonth, today).Row().Scan(&total)
	return total
}

func (a *App) FindTotalTimePlayedLastYear(today string, lastYear string) int64 {
	var total int64
	db.Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ?", lastYear, today).Row().Scan(&total)
	return total
}

func (a *App) FindTotalGamesPlayedLastWeek(today string, lastWeek string) []models.AppData {
	var appData []models.AppData
	db.Raw("SELECT * from app_data WHERE updated_at >= ? AND updated_at <= ? ORDER BY updated_at desc", lastWeek, today).Scan(&appData)
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

func (a *App) HowlongtobeatRequest(search string) interface{} {
	checkCoon := utils.Connected()

	if checkCoon {
		return howlongtobeat.Search(search)
	}
	return false
}

func (a *App) TimePlayedByDayThisWeek(one models.WeekDay, two models.WeekDay, three models.WeekDay, four models.WeekDay,
	five models.WeekDay, six models.WeekDay, seven models.WeekDay, gameId int) models.Datas {

	var countOne sql.NullInt64
	var countTwo sql.NullInt64
	var countThree sql.NullInt64
	var countFour sql.NullInt64
	var countFive sql.NullInt64
	var countSix sql.NullInt64
	var countSeven sql.NullInt64

	oneDay := db.Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", one.Yesterday, one.Today, gameId).Scan(&countOne)

	if oneDay != nil {
		fmt.Println(oneDay)
	}

	twoDay := db.Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", two.Yesterday, two.Today, gameId).Scan(&countTwo)

	if twoDay != nil {
		fmt.Println(twoDay)
	}

	threDay := db.Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", three.Yesterday, three.Today, gameId).Scan(&countThree)

	if threDay != nil {
		fmt.Println(threDay)
	}

	fourDay := db.Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", four.Yesterday, four.Today, gameId).Scan(&countFour)

	if fourDay != nil {
		fmt.Println(fourDay)
	}

	fiveDay := db.Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", five.Yesterday, five.Today, gameId).Scan(&countFive)

	if fiveDay != nil {
		fmt.Println(fiveDay)
	}

	sixDay := db.Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", six.Yesterday, six.Today, gameId).Scan(&countSix)

	if sixDay != nil {
		fmt.Println(sixDay)
	}

	sevenDay := db.Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", seven.Yesterday, seven.Today, gameId).Scan(&countSeven)

	if sevenDay != nil {
		fmt.Println(sevenDay)
	}

	return models.Datas{
		CountOne:   countOne.Int64,
		CountTwo:   countTwo.Int64,
		CountThree: countThree.Int64,
		CountFour:  countFour.Int64,
		CountFive:  countFive.Int64,
		CountSix:   countSix.Int64,
		CountSeven: countSeven.Int64,
	}
}

// SysInfo gets system information
func (a *App) Pcspecs() interface{} {
	// specs := models.SysInfo{
	// 	Hostname:  pcs.Spec().Hostname,
	// 	Platform:  pcs.Spec().Platform,
	// 	OsNumber:  pcs.Spec().OsNumber,
	// 	CPU:       pcs.Spec().CPU,
	// 	GPU:       pcs.Spec().GPU,
	// 	RAM:       pcs.Spec().RAM,
	// 	Disk:      pcs.Spec().Disk,
	// 	MAINBOARD: pcs.Spec().MAINBOARD,
	// }
	return pcs.Spec()
}
