package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"

	models "cronos/backend/models"

	"cronos/backend"
	db "cronos/backend/db"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	// Setup connection to database
	db.Connect()

	// Create an instance of the app structure
	app := backend.NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Cronos",
		Width:     1220,
		Height:    720,
		Assets:    assets,
		OnStartup: app.Startup,
		Bind: []interface{}{
			app,
			&models.AppData{},
		},
	})

	if err != nil {
		println("Error:", err)
	}
}
