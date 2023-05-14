package backend

import (
	"cronos/backend/db"
	"cronos/backend/models"
)

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
