package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
)

func main() {
	var samplesPath string
	var portFlag int

	flag.StringVar(&samplesPath, "path", "../samples", "path to the samples folder")
	flag.IntVar(&portFlag, "port", 5005, "path to the samples folder")
	flag.Parse()

	port := fmt.Sprintf(":%d", portFlag)

	fileServer := http.FileServer(http.Dir(samplesPath))
	cors := CORSMiddleware{fileServer}
	content := ContentTypeMiddleware{"audio/x-wav", cors}

	fmt.Println("listening on port", port)

	err := http.ListenAndServe(port, content)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

type CORSMiddleware struct {
	handler http.Handler
}

func (c CORSMiddleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	c.handler.ServeHTTP(w, r)
}

type ContentTypeMiddleware struct {
	contentType string
	handler     http.Handler
}

func (c ContentTypeMiddleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", c.contentType)
	c.handler.ServeHTTP(w, r)
}
