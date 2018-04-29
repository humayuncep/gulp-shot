
#Shot
Shot is a Node library that uses **Puppeteer** which provides a high-level API to control headless **Chrome** or **Chromium** over the DevTools Protocol. It can also be configured to use full (non-headless) Chrome or Chromium. It creates an instance of Browser, open pages, and then navigates the all pages in the **theme** folder and saves the screenshots in the **dist** folder one by one.

Open a `**terminal**` at the root folder and run the following command to *install* the dependencies.
```
npm i
```
Then go the `***theme***` folder and open a simple http server with port `***3000***`
```
cd theme
```
The following command will create a python http server.
For earlier version of python:
```
python -m SimpleHTTPServer 3000
```
For python 3:
```
python3 -m http.server 3000
```
