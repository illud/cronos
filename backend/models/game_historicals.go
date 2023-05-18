package models

import "gorm.io/gorm"

type GameHistoricals struct {
	gorm.Model
	Id     int64
	GameId int64
	Time   int64
}
