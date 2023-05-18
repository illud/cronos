package models

import "gorm.io/gorm"

type Games struct {
	gorm.Model
	Id         int64
	Image      string
	Name       string
	Path       string
	Executable string
	Time       int64
	Running    bool
}
