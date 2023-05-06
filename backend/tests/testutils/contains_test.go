package testutils

import (
	utils "cronos/backend/utils"
	"testing"
)

func TestContains(t *testing.T) {
	expect := true

	got := utils.Contains([]string{"fuck", "you"}, "you")

	if got != expect {
		t.Errorf("Expected : %v Got: %v", expect, got)
	}
}

func TestContainsFail(t *testing.T) {
	expect := false

	got := utils.Contains([]string{"fuck", "you"}, "yo")

	if got != expect {
		t.Errorf("Expected : %v Got: %v", expect, got)
	}
}
