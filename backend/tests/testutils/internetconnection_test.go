package testutils

import (
	utils "cronos/backend/utils"
	"testing"
)

func TestConnected(t *testing.T) {
	expected := true
	got := utils.Connected()

	if got != expected {
		t.Errorf("Expected: %v Got: %v", expected, got)
	}
}
