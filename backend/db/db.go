package db

import (
	"cronos/backend/models"
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	// DB The database connection
	db *gorm.DB
)

// Connect to database
func Connect() {
	//CONNECTION
	dbCon, err := gorm.Open(sqlite.Open("cronos.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	dbCon.AutoMigrate(&models.AppData{}, &models.GameHistorical{})

	// defer dbCon.Close()
	db = dbCon
	fmt.Println("CONNECTED")

	// Sets all collumn running to false
	dbCon.Model(&models.AppData{}).Where("id > 0 AND running = ?", true).Update("running", false)

}

func Client() *gorm.DB {
	return db
}
