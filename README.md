# CRONOS

## About

Cronos is a app built with  [Wails](https://wails.io/) that allows you to track the time of apps running, games, in app howlongtobeat and pc specs.

![Alt text](images/inapp/1.jpg?raw=true "Games")
![Alt text](images/inapp/2.jpg?raw=true "Stats")
![Alt text](images/inapp/3.jpg?raw=true "HowLongTobeat")
![Alt text](images/inapp/4.jpg?raw=true "Pc Specs")

## ¿Why [Wails](https://wails.io/)  and not [Tauri](https://tauri.app/) ?

Wails is enough to run all the process also with Go is easy to add and use Sqlite besides easy to use packages for cron jobs, computer process etc.

## Live Development

To run in live development mode, run `wails dev` in the project directory. In another terminal, go into the `frontend`
directory and run `npm run dev`. The frontend dev server will run on http://localhost:34115. Connect to this in your
browser and connect to your application.

## Building

To build a redistributable, production mode package, use `wails build` or `wails build -nsis` for installer.
