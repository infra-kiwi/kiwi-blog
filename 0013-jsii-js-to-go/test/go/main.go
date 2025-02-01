/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

package main

import (
	"fmt"
	"kiwi_blog/jsii_js_to_go"
)

// Convenient utility
func ptr[T ~string](s T) *T {
	return &s
}

func main() {
	// Initialize a struct
	home := &jsii_js_to_go.Home{
		Address: ptr("Wariolane 24"),
	}

	// Initialize a class
	addressor := jsii_js_to_go.NewAddressor()
	greeting := addressor.GetFullGreeting(
		// Use a constant
		jsii_js_to_go.Constants_Name(),
		home,
	)

	fmt.Println(*greeting)
}
