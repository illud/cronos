package backend

import (
	db "cronos/backend/db"
	models "cronos/backend/models"
	utils "cronos/backend/utils"
	"fmt"
	"log"
	"os"
	"os/exec"
	"syscall"
	"time"

	"github.com/illud/howlongtobeat"
	"github.com/robfig/cron/v3"
	"github.com/shirou/gopsutil/process"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

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
	db.Client().Model(&models.Games{}).Where("id = ?", id).Update("running", true)

	// Insert into historical if dosn't exist
	var gameHistoricals []models.GameHistoricals
	db.Client().Where("game_id = ? AND created_at >= ? AND created_at < ?", id, today, tomorrow).Find(&gameHistoricals)

	if len(gameHistoricals) <= 0 {
		db.Client().Create(&models.GameHistoricals{GameId: id, Time: 0})
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
			var games models.Games
			db.Client().Find(&games, id)
			timing := games.Time
			db.Client().Model(&models.Games{}).Where("id = ?", id).Update("time", timing+30)
			db.Client().Model(&models.Games{}).Where("id = ?", id).Update("running", true)
			timing = 0

			// updates time historical by created_at
			var gameHistoricals models.GameHistoricals
			db.Client().Where("game_id = ? AND created_at >= ? AND created_at < ?", id, today, tomorrow).Find(&gameHistoricals)
			gameTiming := gameHistoricals.Time

			db.Client().Model(&models.GameHistoricals{}).Where("id = ?", gameHistoricals.Id).Update("time", gameTiming+30)
			gameTiming = 0

			// fmt.Println(p.Name())
			// fmt.Println("FOUND")
			// fmt.Println(secondsToMinutes(time))
			// fmt.Println(time)

			// return p.Kill()
		} else {
			// fmt.Println("false")
			db.Client().Model(&models.Games{}).Omit("updated_at").Where("id = ?", id).Update("running", false)

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
