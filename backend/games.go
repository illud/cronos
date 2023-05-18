package backend

import (
	"cronos/backend/db"
	"cronos/backend/models"
)

// Inserts new data into the games table
func (a *App) Create(image string, name string, path string, executable string, time int64) {
	// Create
	db.Client().Create(&models.Games{Image: image, Name: name, Path: path, Executable: executable, Time: time, Running: false})
}

// Updates data in the games table
func (a *App) Update(id int64, name string, path string, executable string) {
	// Update
	db.Client().Model(&models.Games{}).Omit("updated_at").Where("id = ?", id).UpdateColumns(models.Games{Name: name, Path: path, Executable: executable})
}

// Deletes data from the games table
func (a *App) DeleteApp(id int64) {
	// Delete
	var games models.Games
	db.Client().Delete(&games, id)
}

// Finds all data in the games table order by updated_at
func (a *App) FindAll() []models.Games {
	// Read
	var games []models.Games
	db.Client().Order("updated_at desc").Find(&games)
	return games
}

// Find one data in the games table order by id
func (a *App) FindOne(gameId int64) models.Games {
	// Read
	var games models.Games
	db.Client().Where("id = ?", gameId).Find(&games)
	return games
}
