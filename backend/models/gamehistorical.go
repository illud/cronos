package models

import "gorm.io/gorm"

type GameHistorical struct {
	gorm.Model
	Id     int64
	GameId int64
	Time   int64
}
