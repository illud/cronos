package backend

import (
	db "cronos/backend/db"
	models "cronos/backend/models"
	"database/sql"
	"fmt"
)

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
