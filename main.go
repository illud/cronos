package main

import (
	"embed"

	models "cronos/backend/models"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/windows"

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
		MinWidth:  1220,
		MinHeight: 720,
		Assets:    assets,
		OnStartup: app.Startup,
		Bind: []interface{}{
			app,
			&models.Games{},
		},
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
			// BackdropType:                      windows.Mica,
			DisableWindowIcon:                 false,
			DisableFramelessWindowDecorations: false,
			WebviewUserDataPath:               "",
			WebviewBrowserPath:                "",
			Theme:                             windows.Dark,
		},
	})

	if err != nil {
		println("Error:", err)
	}
}
