package models

type SysInfo struct {
	Hostname  string `json:"hostname"`
	Platform  string `json:"platform"`
	OsNumber  string `json:"osNumber"`
	CPU       string `json:"cpu"`
	GPU       string `json:"gpu"`
	RAM       string `json:"ram"`
	Disk      int64  `json:"disk"`
	MAINBOARD string `json:"mainboard"`
}
