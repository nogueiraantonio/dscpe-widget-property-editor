# Widget Template Vue

## Why

This is Template to build a Vue.js based widget.

## Prereq

Download and install node 10.16.2 LTS - https://nodejs.org/dist/v10.16.2/node-v10.16.2-x64.msi

## How

Install dependencies

    npm install

For development, start a local server

    npm start

In case of developing within a 3DDashboard, you must configure the base URL of your widget before starting the local server

    npm config set widget-template-vue:publicPath "https://3dexp.19xfd03.ds/WidgetLab/"

For production, build the template

    npm run build
