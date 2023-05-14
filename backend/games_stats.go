package backend

import (
	db "cronos/backend/db"
	models "cronos/backend/models"
)

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
