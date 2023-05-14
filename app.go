package main

import (
	"context"
	models "cronos/backend/models"
	utils "cronos/backend/utils"
	"database/sql"
	"fmt"
	"log"
	"os"
	"os/exec"
	"syscall"
	"time"

	db "cronos/backend/db"

	"github.com/robfig/cron/v3"
	"github.com/saturnavt/howlongtobeat"
	pcs "github.com/saturnavt/pcspecs"
	"github.com/shirou/gopsutil/process"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Main START
// Inserts new data into the appdata table
func (a *App) Create(image string, name string, path string, executable string, time int64) {
	// Create
	db.Client().Create(&models.AppData{Image: image, Name: name, Path: path, Executable: executable, Time: time, Running: false})
}

// Updates data in the appdata table
func (a *App) Update(id int64, name string, path string, executable string) {
	// Update
	db.Client().Model(&models.AppData{}).Omit("updated_at").Where("id = ?", id).UpdateColumns(models.AppData{Name: name, Path: path, Executable: executable})
}

// Deletes data from the appdata table
func (a *App) DeleteApp(id int64) {
	// Delete
	var appData models.AppData
	db.Client().Delete(&appData, id)
}

// Finds all data in the appdata table order by updated_at
func (a *App) FindAll() []models.AppData {
	// Read
	var appData []models.AppData
	db.Client().Order("updated_at desc").Find(&appData)
	return appData
}

// Find one data in the appdata table order by id
func (a *App) FindOne(gameId int64) models.AppData {
	// Read
	var appData models.AppData
	db.Client().Where("id = ?", gameId).Find(&appData)
	return appData
}

// Main END

// GamesStats START

// Finds total time played (gets sum of all game time)
func (a *App) FindTotalTimePlayed() int64 {
	var total int64
	db.Client().Table("game_historicals").Select("SUM(time)").Row().Scan(&total)
	return total
}

// Finds most played game
func (a *App) FindMostPlayedGame() models.MosPlayedGame {
	var mostPlayedGame models.MosPlayedGame
	db.Client().Table("app_data").Select("name, MAX(time) AS total").Where("deleted_at IS NULL").Find(&mostPlayedGame)
	return mostPlayedGame
}

// finds total time played by game today
func (a *App) FindTotalTimePlayedByGameToday(today string, tomorrow string, id []int64) []int64 {
	var totalPlayedToday []int64

	var total int64
	for i := 0; i < len(id); i++ {
		total = 0 // resets total for each loop
		db.Client().Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ? AND game_id = ?", today, tomorrow, id[i]).Row().Scan(&total)
		totalPlayedToday = append(totalPlayedToday, total)
	}

	return totalPlayedToday
}

// finds total time played by game this week
func (a *App) FindTotalTimePlayedByGameThisWeek(today string, lastWeek string, id []int64) []int64 {
	var totalPlayedThisWeek []int64

	var total int64
	for i := 0; i < len(id); i++ {
		total = 0 // resets total for each loop
		db.Client().Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ? AND game_id = ?", lastWeek, today, id[i]).Row().Scan(&total)
		totalPlayedThisWeek = append(totalPlayedThisWeek, total)
	}

	return totalPlayedThisWeek
}

// finds total time played this week
func (a *App) FindTotalTimePlayedLastWeek(today string, lastWeek string) int64 {
	var total int64
	db.Client().Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ?", lastWeek, today).Row().Scan(&total)
	return total
}

func (a *App) FindTotalTimePlayedToday(today string, tomorrow string) int64 {
	var total int64
	db.Client().Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ?", today, tomorrow).Row().Scan(&total)
	return total
}

// Finds total time played this month
func (a *App) FindTotalTimePlayedLastMonth(today string, lastMonth string) int64 {
	var total int64
	db.Client().Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ?", lastMonth, today).Row().Scan(&total)
	return total
}

// Finds total time played this year
func (a *App) FindTotalTimePlayedLastYear(today string, lastYear string) int64 {
	var total int64
	db.Client().Table("game_historicals").Select("SUM(time)").Where("created_at >= ? AND created_at <= ?", lastYear, today).Row().Scan(&total)
	return total
}

// Finds games played this week
func (a *App) FindTotalGamesPlayedLastWeek(today string, lastWeek string) []models.AppData {
	var appData []models.AppData
	db.Client().Raw("SELECT * from app_data WHERE updated_at >= ? AND updated_at <= ? ORDER BY updated_at desc", lastWeek, today).Scan(&appData)
	return appData
}

// GamesStats END

// GameDetails START
// Finds time played this week by day
func (a *App) TimePlayedByDayThisWeek(one models.WeekDay, two models.WeekDay, three models.WeekDay, four models.WeekDay,
	five models.WeekDay, six models.WeekDay, seven models.WeekDay, gameId int) models.Datas {

	var countOne sql.NullInt64
	var countTwo sql.NullInt64
	var countThree sql.NullInt64
	var countFour sql.NullInt64
	var countFive sql.NullInt64
	var countSix sql.NullInt64
	var countSeven sql.NullInt64

	oneDay := db.Client().Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", one.Yesterday, one.Today, gameId).Scan(&countOne)

	if oneDay != nil {
		fmt.Println(oneDay)
	}

	twoDay := db.Client().Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", two.Yesterday, two.Today, gameId).Scan(&countTwo)

	if twoDay != nil {
		fmt.Println(twoDay)
	}

	threDay := db.Client().Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", three.Yesterday, three.Today, gameId).Scan(&countThree)

	if threDay != nil {
		fmt.Println(threDay)
	}

	fourDay := db.Client().Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", four.Yesterday, four.Today, gameId).Scan(&countFour)

	if fourDay != nil {
		fmt.Println(fourDay)
	}

	fiveDay := db.Client().Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", five.Yesterday, five.Today, gameId).Scan(&countFive)

	if fiveDay != nil {
		fmt.Println(fiveDay)
	}

	sixDay := db.Client().Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", six.Yesterday, six.Today, gameId).Scan(&countSix)

	if sixDay != nil {
		fmt.Println(sixDay)
	}

	sevenDay := db.Client().Raw("SELECT SUM(time) FROM game_historicals WHERE created_at >= ? AND created_at <= ? AND game_id = ?", seven.Yesterday, seven.Today, gameId).Scan(&countSeven)

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

// GameDetails END

// Creates a bat file to run the game
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

// Executes the bat file
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

// Checks if the game is running
func (a *App) CheckRunningProcess(name string, id int64, today string, tomorrow string) {
	// fmt.Println(name)

	// Sets running to true
	db.Client().Model(&models.AppData{}).Where("id = ?", id).Update("running", true)

	// Insert into historical if dosn't exist
	var gameHistorical []models.GameHistorical
	db.Client().Where("game_id = ? AND created_at >= ? AND created_at < ?", id, today, tomorrow).Find(&gameHistorical)

	if len(gameHistorical) <= 0 {
		db.Client().Create(&models.GameHistorical{GameId: id, Time: 0})
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
			db.Client().Find(&appData, id)
			timing := appData.Time
			db.Client().Model(&models.AppData{}).Where("id = ?", id).Update("time", timing+30)
			db.Client().Model(&models.AppData{}).Where("id = ?", id).Update("running", true)
			timing = 0

			// updates time historical by created_at
			var gameHistorical models.GameHistorical
			db.Client().Where("game_id = ? AND created_at >= ? AND created_at < ?", id, today, tomorrow).Find(&gameHistorical)
			gameTiming := gameHistorical.Time

			db.Client().Model(&models.GameHistorical{}).Where("id = ?", gameHistorical.Id).Update("time", gameTiming+30)
			gameTiming = 0

			// fmt.Println(p.Name())
			// fmt.Println("FOUND")
			// fmt.Println(secondsToMinutes(time))
			// fmt.Println(time)

			// return p.Kill()
		} else {
			// fmt.Println("false")
			db.Client().Model(&models.AppData{}).Omit("updated_at").Where("id = ?", id).Update("running", false)

			// Stop the cron job when playing again
			c.Stop()
		}

	})
	fmt.Println("CRON JOB STARTED")
	c.Start()
	select {}
}

// Excutes file search doalog
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

// Fetches game data from howlongtobeat
func (a *App) HowlongtobeatRequest(search string) interface{} {
	checkCoon := utils.Connected()

	if checkCoon {
		return howlongtobeat.Search(search)
	}
	return false
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
