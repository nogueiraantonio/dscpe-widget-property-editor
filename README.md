# Widget Template Vue

## Why

This template is meant to ease the development of 3DDashboard Widgets.

## Before starting

3DDashboard Widgets are HTML5 based applications (with some specificifies). Therefore, you absolutely need to have a good knowledge of the following
technologies :

-   **HTML**
-   **Javascript**
-   **CSS**

Also, as we are lazy devlopers, we like to ease our lives using some good frameworks, & technologies. This template includes many and you won't get a chance to
play around if you don't know :

-   [Vue.js](https://vuejs.org/) - Consider spending 1 hour on [this training](https://scrimba.com/g/glearnvue) on Scrimba.
-   [Vuetify](https://vuetifyjs.com) - This UI Framework will drastically saves you time. Neverthess, it's optionnal so feel free to remove the dependency and
    use your favourite.
-   [Vuex](https://vuex.vuejs.org/) - This is the "store" object you will find in the template. If you are new to Vue.js, don't touch this for now. Only when
    you feel that props & emits are bothering you may come back here and learn about vuex.
-   [ES6](http://es6-features.org/) - You thought javascript is crap ? me too. But that was before ES6...
-   [RequireJS](https://requirejs.org/) - That's the way you get access to 3DDashboard APIs. Wheter you like or not.
-   _Widget and 3DDashboard_ - Well, either you've been trained (lucky you), either you have a good documentation, either... In any case, you need to know the
    basics.

Now that we're good with front-end libraries, let's have a look to the tooling we use :

-   [Visual Studio Code](https://code.visualstudio.com/) - You can use your favourite code editor. We do use VSCode and recommend it.
-   [NodeJS](https://nodejs.org/en/) - You won't be able to build the widget without NodeJS. It's also the only **mandatory** tool you need to install manualy.
    We encountered issues with the last version, until this is fixed, please use the **[LTS](https://nodejs.org/dist/v10.16.2/node-v10.16.2-x64.msi)** version
    please.

Download and install node 10.16.2 LTS - https://nodejs.org/dist/v10.16.2/node-v10.16.2-x64.msi

## How

Now that you've carefuly read the **Before starting** section, **[NodeJS](https://nodejs.org/dist/v10.16.2/node-v10.16.2-x64.msi)** is installed ;

1. Get the sources

If you are familiar with GIT, clone our repo

    git clone https://itgit.dsone.3ds.com/widget-lab/widget-template-vue.git

Or you can simply download the [source code](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue/-/archive/master/widget-template-vue-master.zip) and
unzip it wherever you prefer.

2. Install the development dependencies :

Open the source code directory in VS Code and in the terminal

    npm install

For development, start a local server

    npm start

In case of developing within a 3DDashboard, you must configure the base URL of your widget before starting the local server

    npm config set widget-template-vue:publicPath "https://3dexp.19xfd03.ds/WidgetLab/"

For production, build the template

    npm run build

## CI / CD

This template is ready for Gitlab CI / CD, please refer to [CI/CD Setup Guide](/build/Gitlab-CI-Setup.md)
