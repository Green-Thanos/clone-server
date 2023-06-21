package main

import (
    "fmt"
    "net/http"
    "strings"
	"io"
	"io/ioutil"
	"os"
)

type API struct {
}

func (api *API) DownloadWebsite(url string) error {
    fmt.Println("Downloading website from: ", url)
    resp, err := http.Get(url)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    arr := strings.Split(url, "/")
	filename := arr[len(arr)-1] + ".html"
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    _, err = io.Copy(file, resp.Body)
    if err != nil {
        return err
    }

    return nil
}

func (api *API) GetWebsite(url string) ([]byte, error) {
    fmt.Println("Getting website from: ", url)
    resp, err := http.Get(url)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    contents, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    return contents, nil
}

func main() {
    api := &API{}

    http.HandleFunc("/download", func(w http.ResponseWriter, r *http.Request) {
        url := r.URL.Query().Get("url")
        err := api.DownloadWebsite(url)
        if err != nil {
            w.WriteHeader(http.StatusInternalServerError)
            return
        }

        w.WriteHeader(http.StatusOK)
    })

    http.HandleFunc("/get", func(w http.ResponseWriter, r *http.Request) {
        url := r.URL.Query().Get("url")
        contents, err := api.GetWebsite(url)
        if err != nil {
            w.WriteHeader(http.StatusInternalServerError)
            return
        }

        w.Write(contents)
    })

    // do comments work like this

    /* what about this */
    fmt.Println("Server running at port 8080!")

    http.ListenAndServe(":8080", nil)
}
