package models

type SysInfo struct {
	Hostname  string `bson:hostname`
	Platform  string `bson:platform`
	OsNumber  string `bson:osNumber`
	CPU       string `bson:cpu`
	GPU       string `bson:gpu`
	RAM       string `bson:ram`
	Disk      int64  `bson:disk`
	MAINBOARD string `bson:mainboard`
}
