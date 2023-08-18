package backend

import (
	pcs "github.com/illud/pcspecs"
)

// SysInfo gets system information
func (a *App) Pcspecs() interface{} {
	// specs := models.SysInfo{
	// 	Hostname:  pcs.Spec().Hostname,
	// 	Platform:  pcs.Spec().Platform,
	// 	OsNumber:  pcs.Spec().OsNumber,
	// 	CPU:       pcs.Spec().CPU,
	// 	GPU:       pcs.Spec().GPU,
	// 	RAM:       pcs.Spec().RAM,
	// 	Disk:      pcs.Spec().Disk,
	// 	MAINBOARD: pcs.Spec().MAINBOARD,
	// }
	return pcs.Spec()
}
