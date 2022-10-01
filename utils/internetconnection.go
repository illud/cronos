package utils

import "net/http"

// This functions is to check is theres internet
func Connected() (ok bool) {
	_, err := http.Get("https://www.google.com/")
	if err != nil {
		return false
	}
	return true
}
