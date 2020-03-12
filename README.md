<!-- markdownlint-disable MD001 MD024 -->

# Widget Template with Vue, VueX & Vuetify

This widget is an extension of [Widget Template Vue.js light](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue-light).

This template is meant to ease the development of 3DDashboard Widgets.

![Screen Capture](https://btcc.s3-eu-west-1.amazonaws.com/WidgetLab/ressources/WidgetTemplateDemoV3.gif)

With this template we focused on having the best possible development experience compatible with the 3DDashboard infrastructure. Hence we provide not only a code sample but a full development environment based on widgets & web development best practices:

- Continuous Integration (GitLab CI)
- Build with bundling (webpack)
- Linting (eslint) and formatting (Prettier)
- Tests (Mocha)

Using this environment has many advantages :

- Ability do develop _outside_ of the 3DDashboard
- Hot & Live Reload: as soon as you modify a file, the change is applied in your web browser without a single action (even if your 3DEXPERIENCE Platform is on the cloud)
- Compliance with the latest front-end technologies (it's time to forget jQuery!)
- Ability to use the browser's debugger even in "modules"

Basically, you will be able to develop a widget like any other web application!

But that comes with a small price: some setup is required...

## Installation

### Get the sources

You can download the [template zip](https://btcc.s3-eu-west-1.amazonaws.com/widget-lab/templates/widget-template-vue.zip) and unzip it wherever you prefer.

### Install the development dependencies

Open a terminal in the location you've put the downloaded / cloned sources, then:

```bash
npm install
```

### Build the Widget

```bash
npm run build
```

### Start the Widget

```bash
npm start
```

For further documentation, installation, configuration, please refer to the [Widget Template Vue.js light documentation](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue-light/blob/master/Configuration.md)

## Added features (from light version)

We added these development best practices:

- Continuous Integration (GitLab CI)
- Tests (Mocha)

Also, we added some good frameworks:

- [Vuetify](https://vuetifyjs.com) - This UI Framework will drastically save your time. Nevertheless, it's optional so feel free to remove the dependency and use your favorite.
- [Vuex](https://vuex.vuejs.org/) - This is the "store" object you will find in the template. If you are new to Vue.js, 
