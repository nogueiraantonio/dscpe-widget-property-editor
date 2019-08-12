# Widget Template Vue

## Introduction

> This template is meant to ease the development of 3DDashboard Widgets.

// TODO : what does the provided environment does for you (hot reload, standalone capability, etc.)

## Before starting

3DDashboard Widgets are HTML5 based applications (with some specificities). Therefore, you absolutely need to have a good knowledge of the following
technologies :

- **HTML**
- **Javascript**
- **CSS**

Also, as we are lazy developers, we like to ease our lives using some good frameworks, & technologies. This template includes many of these and you won't get a
chance to play around if you don't know :

- [Vue.js](https://vuejs.org/) - Consider spending 1 hour on [this training](https://scrimba.com/g/glearnvue) on Scrimba.
- [Vuetify](https://vuetifyjs.com) - This UI Framework will drastically saves you time. Nevertheless, it's optional so feel free to remove the dependency and
  use your favorite.
- [Vuex](https://vuex.vuejs.org/) - This is the "store" object you will find in the template. If you are new to Vue.js, don't touch this for now. Only when you
  feel that props & emits are bothering you may come back here and learn about vuex.
- [ES6](http://es6-features.org/) - You thought javascript is crap ? me too. But that was before ES6...
- [RequireJS](https://requirejs.org/) - That's the way you get access to 3DDashboard APIs. Whether you like or not.
- _Widget and 3DDashboard_ - Well, either you've been trained (lucky you), either you have a good documentation, either... In any case, you need to know the
  basics.

Now that we're good with front-end libraries, let's have a look to the tooling we use :

- [Visual Studio Code](https://code.visualstudio.com/) - You can use your favorite code editor. We do use VSCode and recommend it.
- [NodeJS](https://nodejs.org/en/) - It won't be possible to build the widget without NodeJS. It's also the only **mandatory** tool you need to install
  manually. We encountered issues with the last version so until this is fixed, please use the **[LTS](https://nodejs.org/dist/v10.16.2/node-v10.16.2-x64.msi)**
  version.
- [Webpack](https://webpack.js.org/) - We use webpack to build our source code into a single bundle (_and yes - we also do use requirejs as it's mandatory for
  3DDashboard integration_). It comes with many plugins to transpile the source, copy assets, allows hot reload in developing phases, etc. If you stick with our
  framework stack, you won't need to change & understand the configuration. If you do, the configuration files are in the `build/` directory.

## Build by yourself

Now that you've carefuly read the [Before starting](#before-starting) section, [NodeJS](https://nodejs.org/dist/v10.16.2/node-v10.16.2-x64.msi) is installed ;

### 1. Get the sources

If you are familiar with GIT, clone our repo

```bash
git clone https://itgit.dsone.3ds.com/widget-lab/widget-template-vue.git
```

OR

You can simply download the [source code](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue/-/archive/master/widget-template-vue-master.zip) and unzip
it wherever you prefer.

### 2. Install the development dependencies

In a terminal :

```bash
npm install
```

### 3. Build the Widget

```bash
npm run build
```

When the build is finished, a new directory `dist/` is created. You'll find there the necessary files to run your widget. The entry point being `index.html`.
Push this to your favorite HTTP server and try it right away using the _Run your App_ Widget.

## Start developing

When developing Widgets, most of the time you will want to test in a 3DDashboard context. And sometimes you may not need to rely on 3DDashboard APIs that much
so developing outside of the 3DDashboard may be more convenient. We identified 3 use cases which leads to different development environments setup:

1. Standalone Widget (developed outside 3DDashboard, but that is executed inside)

   Consider trying this option before going further. There is no special setup.

2. Widget executed on a 3DDashboard located on the same network (such as a 3DExperience VM, private cloud, etc.)

   This settup is the most convenient when it is possible (limitations are detailled bellow) but it is the one that requires the most configuration.

3. Widget executed a 3DDashboard located anywhere (such as public cloud)

   This settup is easier to put in place than the previous one but hot reloading will be slightly slower (due to file upload on internet).

> _same network_ must be understood as: the server hosting the 3DDashboard can reach your development environment through HTTPS AND you can configure this
> server. If it is not the case please consider option 1 or 3.

Assuming you have [downloaded the sources](#1-get-the-sources) and [installed the development dependencies](#2-install-the-development-dependencies), now open
the source code directory in VS Code.

### 1. Standalone Widget

This setup will serve the Widget in a local HTTP server.

```bash
npm start
```

The command will compile the Widget, start an HTTP server ([express](https://expressjs.com/)) and open a web browser loading the Widget entry point. Hot reload
is enabled so if you modify and save a file (try with `components/how-to.vue`), the browser will automatically refresh the Widget.

### 2. Widget running on the same network

As in [Standalone Widget](#1-standalone-widget), the Widget will be served from a local HTTP server, but will be executed within a 3DDashboard. Therefore, due
to the 3DDashboard infrastructure, your local HTTP server must be reachable by the server running the 3DDashboard.

Moreover due to [mixed content policy](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content) and the fact that your 3DExperience Platform must
run using HTTPS, your local server must serve HTTP**S** (and not simple HTTP).

Also, the 3DDashboard won't let you run a non trusted Widget. That imply that the 3DExperience server trusts your local server.

That brings some more configration steps, but nothing impossible.

You need a few things:

- Configure the local server to serve HTTPS,
- Configure your browser(s) and your machine to trust your server (Setupping HTTPS).

#### Setupping HTTPS

We recommend using [mkcert](https://github.com/FiloSottile/mkcert) - do read that documentation, it's strictly what we are doing bellow but more detailed.

The tool will assist you in creating the necessary files, store & keys, configure your OS and your browsers. Download the
[binaries](https://github.com/FiloSottile/mkcert/releases) corresponding to your OS, then

```bash
mkcert -install
mkcert localhost mywidget.dev 127.0.0.1 ::1
```

#### Configure Webpack-dev-server

[Webpack-dev-server](https://webpack.js.org/configuration/dev-server/) is the Webpack module that allows Hot Reload when developing. This module is responsible
for creating the HTTPS server.

Edit the configuration file `build/webpack.config.dev.js`, look for _https_ in the definition of the _devServer_ object. Replace the following entries with the
files you've created with mkcert:

```javascript
devServer: {
    ...
    https: {
        key: fs.readFileSync("PATH_TO_YOUR_KEY/localhost+3-key.pem"),
        cert: fs.readFileSync("PATH_TO_YOUR_CRT/localhost+3.pem"),
        ca: fs.readFileSync("PATH_TO_YOUR_ROOT_STORE/rootCA.pem")
    }
}
```

#### Start the server

```bash
npm start
```

### 3. Widget running on a different network

In case of developing within a 3DDashboard, you must configure the base URL of your widget before starting the local server

```bash
npm config set widget-template-vue:publicPath "https://3dexp.19xfd03.ds/WidgetLab/"
```

## Start sharing

You've enhanced our template? please open a pull request and we'll evaluate the opportunity to include your code in our template.

## CI / CD

This template is ready for Gitlab CI / CD, please refer to [CI/CD Setup Guide](/build/Gitlab-CI-Setup.md)
