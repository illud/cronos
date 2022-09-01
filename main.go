package main

import (
	"embed"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"syscall"
	"time"
	"unsafe"

	"github.com/robfig/cron/v3"

	"github.com/saturnavt/howlongtobeat"
	"github.com/shirou/gopsutil/process"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/host"
	"golang.org/x/sys/windows"
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
	Image      string
	Name       string
	Path       string
	Executable string
	Time       int64
	Running    bool
}

type GameHistorical struct {
	gorm.Model
	Id     int64
	GameId int64
	Time   int64
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
	dbCon.AutoMigrate(&AppData{}, &GameHistorical{})

	// defer dbCon.Close()
	db = dbCon
	fmt.Println("CONNECTED")

	//Sets all collumn running to false
	dbCon.Model(&AppData{}).Where("id > 0 AND running = ?", true).Update("running", false)
}

func (a *App) Create(image string, name string, path string, executable string, time int64) {
	// Create
	db.Create(&AppData{Image: image, Name: name, Path: path, Executable: executable, Time: time, Running: false})
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

func (a *App) CheckRunningProcess(name string, id int64, today string, tomorrow string) {
	// fmt.Println(name)

	// Sets running to true
	db.Model(&AppData{}).Where("id = ?", id).Update("running", true)

	// Insert into historical if dosn't exist
	var gameHistorical []GameHistorical
	db.Where("game_id = ? AND created_at >= ? AND created_at < ?", id, today, tomorrow).Find(&gameHistorical)

	if len(gameHistorical) <= 0 {
		db.Create(&GameHistorical{GameId: id, Time: 0})
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

		if contains(processRunning, name) {
			// fmt.Println("ok")
			// Read
			var appData AppData
			db.Find(&appData, id)
			timing := appData.Time
			db.Model(&AppData{}).Where("id = ?", id).Update("time", timing+30)
			db.Model(&AppData{}).Where("id = ?", id).Update("running", true)
			timing = 0

			// updates time historical by created_at
			var gameHistorical GameHistorical
			db.Where("game_id = ? AND created_at >= ? AND created_at < ?", id, today, tomorrow).Find(&gameHistorical)
			gameTiming := gameHistorical.Time

			db.Model(&GameHistorical{}).Where("id = ?", gameHistorical.Id).Update("time", gameTiming+30)
			gameTiming = 0

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

func (a *App) HowlongtobeatRequest(search string) interface{} {
	// spaceToPorcent := strings.ReplaceAll(search, " ", "%20")

	// resp, err := http.Get("https://node-hltb-api.herokuapp.com/?search=" + spaceToPorcent)
	// if err != nil {
	// 	log.Fatalln(err)
	// }
	// //We Read the response body on the line below.
	// body, err := ioutil.ReadAll(resp.Body)
	// if err != nil {
	// 	log.Fatalln(err)
	// }
	// //Convert the body to type string
	// return string(body)
	checkCoon := connected()

	if checkCoon {
		return howlongtobeat.Search(search)
	}
	return false
}

func connected() (ok bool) {
	_, err := http.Get("https://www.google.com/")
	if err != nil {
		return false
	}
	return true
}

// SysInfo saves the system information
type SysInfo struct {
	Hostname  string `bson:hostname`
	Platform  string `bson:platform`
	OsNumber  string `bson:osNumber`
	CPU       string `bson:cpu`
	GPU       string `bson:gpu`
	RAM       string `bson:ram`
	Disk      int64  `bson:disk`
	MAINBOARD string `bson:mainboard`
}

func (a *App) Pcspecs() SysInfo {
	hostStat, _ := host.Info()
	cpuStat, _ := cpu.Info()
	vmStat, _ := mem.VirtualMemory()
	// diskStat, _ := disk.Usage("\\") // If you're in Unix change this "\\" for "/"

	info := new(SysInfo)

	//Extract os number
	str1 := hostStat.Platform
	re := regexp.MustCompile(`[-]?\d[\d,]*[\.]?[\d{2}]*`)

	submatchall := re.FindAllString(str1, -1)
	info.Hostname = hostStat.Hostname
	info.Platform = hostStat.Platform
	info.OsNumber = submatchall[0]
	info.CPU = cpuStat[0].ModelName
	info.RAM = strconv.FormatUint(vmStat.Total/1024/1024, 10)[0:2]

	// info.Disk = diskStat.Total / 1024 / 1024 / 1e+9

	// fmt.Printf("%+v\n", info)

	// gets GPU info
	videoController := exec.Command("cmd", "/C", "wmic path win32_VideoController get name")
	videoController.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	videoControllerHistory, _ := videoController.Output()
	pcGPU := strings.Replace(string(videoControllerHistory), "Name", "", -1)
	pcGPUString := strings.Replace(pcGPU, "LuminonCore IDDCX Adapter", "", -1)
	info.GPU = pcGPUString

	// gets MAINBOARD info
	mainBoard := exec.Command("cmd", "/C", "wmic path win32_BaseBoard get Product")
	mainBoard.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	mainBoardHistorys, _ := mainBoard.Output()
	mainBoardString := strings.Replace(string(mainBoardHistorys), "Product", "", -1)
	info.MAINBOARD = mainBoardString

	h := windows.MustLoadDLL("kernel32.dll")
	c := h.MustFindProc("GetDiskFreeSpaceExW")

	var freeBytes int64

	_, _, err := c.Call(uintptr(unsafe.Pointer(windows.StringToUTF16Ptr("C:"))),
		uintptr(unsafe.Pointer(&freeBytes)))
	if err != nil {
		fmt.Println(err)
	}
	// fmt.Println(freeBytes / 1e+9)
	info.Disk = freeBytes / 1e+9
	return *info
}
