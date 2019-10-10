<!-- markdownlint-disable MD001 MD024 -->
<!-- https://github.com/DavidAnson/markdownlint/blob/master/README.md#configuration -->

# Widget Template with Vue

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

> ⚠️ Disclaimer ⚠️
>
> This template is provided ​“AS IS”. We make no warranties, express or implied, and hereby disclaim all implied warranties, including any warranty of merchantability and warranty of fitness for a particular purpose. Besides, this template has not been reviewed or validated by the Dassault Systèmes' Research and Development organization.
>
> ⚠️ Disclaimer ⚠️

# 1. Before starting

## 1.1. Web development

3DDashboard Widgets are HTML5 based applications (with some particularities). Therefore, you absolutely need to have a good knowledge of the following technologies:

- **HTML**
- **JavaScript**
- **CSS**
- HTTP, SSL and a good networking general knowledge

## 1.2. Framework

Also, as we are lazy developers, we like to ease our lives using some good frameworks & technologies. This template includes many of these and you won't get a chance to play around if you don't know:

- [Vue.js](https://vuejs.org/) - Consider spending 1 hour on [this training](https://scrimba.com/g/glearnvue) on Scrimba.
- [Vuetify](https://vuetifyjs.com) - This UI Framework will drastically save your time. Nevertheless, it's optional so feel free to remove the dependency and use your favorite.
- [Vuex](https://vuex.vuejs.org/) - This is the "store" object you will find in the template. If you are new to Vue.js, don't touch this for now. Only when you feel that props & emits are bothering, you may come back here and learn about Vuex.
- [ES6](http://es6-features.org/) - You thought JavaScript was crap ? me too. But that was before ES6...
- [RequireJS](https://requirejs.org/) - That's the way you get access to 3DDashboard APIs. Whether you like it or not.
- _Widget and 3DDashboard_ - Well, either you've been trained (lucky you), either you have a good documentation, either... In any case, you need to know the basics.

## 1.3. Tooling

Now that we're good with front-end libraries, let's have a look at the tooling we use:

- [Visual Studio Code](https://code.visualstudio.com/) - You can use your favorite code editor. We do use VSCode and recommend it. Just make sure to accept extensions recommendations when opening the repo with VSCode (e.g. Vue syntax highlighting with Vetur).
- [NodeJS](https://nodejs.org/en/) - It won't be possible to build the widget without NodeJS. It's also the only **mandatory** tool you need to install manually. We encountered issues with the most recent version so until this is fixed, please use the **[LTS](https://nodejs.org/dist/v10.16.2/node-v10.16.2-x64.msi)** version.
- [Webpack](https://webpack.js.org/) - We use webpack to build our source code into a single bundle (_and yes - we also do use requirejs as it's mandatory for 3DDashboard integration_). It comes with many plugins to transpile the source, copy assets, allows hot reload in developing phases, etc. If you stick with our framework stack, you won't need to change & understand the configuration. But if for some reason you need to change our proposed default configuration, the files are in the
  `webpack/` directory.

# 2. Build it yourself

Now that you've carefully read the [Before starting](#1.-before-starting) section, and that [NodeJS](https://nodejs.org/dist/v10.16.2/node-v10.16.2-x64.msi) is installed:

## 2.1. Get the sources

If you are familiar with Git, clone our repo

```bash
$ git clone https://itgit.dsone.3ds.com/widget-lab/widget-template-vue.git
```

This is the recommended option because this allows you to directly propose changes back to us.

OR

You can simply download the [source code](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue/-/archive/master/widget-template-vue-master.zip) and unzip it wherever you prefer.

## 2.2. Install the development dependencies

Open a terminal in the location you've put the downloaded / cloned sources, then:

```bash
$ npm install
```

Wait until it finishes.

## 2.3. Build the Widget

> Note: This step is required to deploy your app in production, but not for development. You will indeed see below that we rely on webpack-dev-server to build the app in RAM and serve it right away, thus skipping the need to build the app on disk.

In the same terminal:

```bash
$ npm run build
```

When the build is finished, a new directory `dist/` is created. You'll find there the necessary files to run your widget. The entry point being `index.html`. Push this to your favorite HTTP server and try it right away using the _Run your App_ Widget.

# 3. Start developing

## 3.1. Use HTTPS

Due to [mixed content policy](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content), before having fun with development, we need to tackle the networking (trust) part. You basically have 2 options:

1. Serve HTTPS content from webpack-dev-server (and not simple HTTP). The easiest option is then to create an auto-signed certificate (recommended if you're admin on your development machine) and share it with the certificate stores. **OR**
1. Ignore your browser's mixed content warnings (fall-back if you're not local admin)

You'll find below the details to implement the first method.

We need to:

- Configure your browser(s) and your machine to trust your own webpack (express) server
- Configure the local server to serve HTTPS

### 3.1.1. Set up HTTPS

We recommend using [mkcert](https://github.com/FiloSottile/mkcert) - do read that documentation, it's strictly what we are doing below but more detailed.

The tool will assist you in creating the necessary files, stores & keys, configure your OS and your browser(s).

1. [Download the binaries](https://github.com/FiloSottile/mkcert/releases) corresponding to your OS.

1. Open a terminal at the same location where you downloaded mkcert installer

1. Create a new CA (Certificate Authority). mkcert will create the CA and update your OS, Java & Firefox stores

   ```bash
       $ mkcert -install
   ```

1. Click to accept the new certificate

1. Retrieve the hostname of your machine

   ```bash
       $ hostname
   ```

1. Create a new certificate

   ```bash
       $ mkcert localhost $hostname 127.0.0.1 ::1
   ```

   > Be careful:
   >
   > - by default mkcert will generate the CA file (`mkcert -install`) in your **user directory** (C:\Users\\\$USER\AppData\Local\mkcert\rootCA.pem on Windows),
   >
   > - while the KEY and CERT files (`mkcert localhost $hostname 127.0.0.1 ::1`) will be placed in the **current directory** (from where you ran mkcert).

### 3.1.2. Configure webpack-dev-server

[webpack-dev-server](https://webpack.js.org/configuration/dev-server/) is the Webpack module that allows Hot Reload when developing. This module is responsible for creating the HTTPS server.

Copy+paste the file `webpack/webpack.config.dev.template.js` in the same location, and rename the copy as `webpack/webpack.config.dev.js`.

> Important: Make sure to **use this file name** so that
>
> - the application works as expected
> - this file is never committed to a repository [(Why?)](https://datree.io/secrets-management-aws/)

Edit the `webpack/webpack.config.dev.js` configuration file, look for _https_ in the definition of the _devServer_ object. Replace the following entries with the files you've created with mkcert:

```javascript
devServer: {
    ...
    https: {
        key: fs.readFileSync("PATH_TO_YOUR_KEY/localhost+3-key.pem"),
        cert: fs.readFileSync("PATH_TO_YOUR_CRT/localhost+3.pem"),
        ca: fs.readFileSync("PATH_TO_YOUR_CA/rootCA.pem")
    }
}
```

## 3.2. Choose the optimal solution for your context

When developing Widgets, most of the time you will want to test in a 3DDashboard context. But sometimes you may not need to rely on 3DDashboard APIs that much, so developing outside of the 3DDashboard may be more convenient.

We identified 3 use cases which lead to different development environments setup:

| Use case          | Description                                                                                                       | Recommendation                                                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Standalone Widget | developed outside 3DDashboard, but that can be built to be executed inside                                        | Consider trying this option before going further. There is no special setup.                                                                   |
| On-premises       | the Widget executed in a 3DDashboard located on the same network (such as a 3DEXPERIENCE VM, private cloud, etc.) | This setup is the most convenient when it is possible (limitations are detailed below) but it is the one that requires the most configuration. |
| Public Cloud      | the Widget executed in a 3DDashboard located anywhere (such as public cloud)                                      | This setup is easier to put in place than the previous one but hot reloading will be slightly slower (due to file upload on internet).         |

> _"same network"_ must be understood as: the server hosting the 3DDashboard can reach your development environment through HTTPS AND you can configure this server. If it is not the case please consider option 1 or 3.

Assuming you have [downloaded the sources](#2.1.-get-the-sources) and [installed the development dependencies](#2.2.-install-the-development-dependencies), open the source code directory in VS Code.

## 3.3. Standalone Widget

This setup will serve the Widget from a local HTTPS server.

```bash
    $ npm start
```

The command will compile the Widget, start an HTTPS server ([express](https://expressjs.com/)) and open your default web browser, loading the Widget entry point. Hot reload is enabled through a secured web socket, so if you modify and save a file (try with `components/how-to.vue`), the browser will automatically refresh the Widget.

> We did not mock everything provided by the 3DEXPERIENCE Platform. If you identify something missing, you can either:
>
> - add it and open a Merge Request
> - open an Issue

## 3.4. On-premises

This method is typically used when your widget is served from a server on the same network as the 3DDashboard, and you can access the 3DDashboard.

### 3.4.1. Prerequisites

You do need to have administrator privileges on the server running the 3DDashboard.

### 3.4.2. Some context

As in [Standalone Widget](#4.2.-standalone-widget), the Widget will be served from a local HTTPS server, but will be executed within a 3DDashboard. Therefore, due to the 3DDashboard infrastructure, your local HTTPS server must be reachable by the server running the 3DDashboard.

Also, the 3DDashboard won't let you run a non trusted Widget (3DEXPERIENCE Platform must run using HTTPS). That implies that the 3DEXPERIENCE server trusts your local server.

That brings one more configuration step: configuring your 3DDashboard Server to trust your local server.

> The following description relies on SSL configuration for your local server. Another approach is to use the 3DEXPERIENCE reverse proxy to redirect to your local environment. We won't detail the steps to configure it but if you are familiar with apache & reverse proxy usage, you can try, it works!

### 3.4.3. Configure your 3DDashboard

We have to add the previously created Certificate Authority to the Java trusted store (as 3DDashboard HTTPS is served by TomEE, using Java store mechanism).

1. Ensure your 3DDashboard is able to reach your host: from your 3DDashboard server:

   ```bash
       $ ping `$hostname`
   ```

1. Copy the `rootCA.pem` on the machine running the 3DDashboard.

1. Stop the 3DDashboard.

1. Open a terminal where the `rootCA.pem` file is located and run the following command (as administrator/root):

   > Make sure the JAVA_HOME is properly set! Else you will face an error like `keytool error: java.io.FileNotFoundException: /jre/lib/security/cacerts (No such file or directory)`

   ```bash
       $ keytool -import -trustcacerts -keystore $JAVA_HOME/jre/lib/security/cacerts -storepass changeit -alias Root -import -file rootCA.pem
   ```

1. You can restart the 3DDashboard.

### 3.4.4. Start debugging

We're almost done !

1. In VS Code terminal, update the configuration & start the development server:

   ```bash
       $ npm config set widget-template-vue:publicPath "https://$hostname:8081/"
       $ npm start
   ```

You will notice the same behavior than in [Standalone mode](#4.2.-standalone-widget).

1. **If you want** to revert the configuration, simply reset the `publicPath` variable:

   ```bash
       $ npm config set widget-template-vue:publicPath ""
   ```

## 3.5. Public Cloud

The typical use case is when your Widget is running on a different network and you don't have access to the 3DDashboard.

### 3.5.1. Prerequisites

You need an HTTPS server on the same network as your 3DDashboard. If on Public Cloud, then Internet is that network.

### 3.5.2. Some context

By design, the 3DDashboard must be able to access the widget code. Therefore in a context where our local machine can't be reached by the server, we'll assume the 3DDashboard can access to Internet. Which is the case for, e.g., the 3DEXPERIENCE public cloud.

That being said we need an internet-facing HTTPS server to do the job.

We do find [AWS S3](https://aws.amazon.com/s3/) very convenient for this purpose and we do encourage its usage.

> If you have any other repository, you'll have to adapt the webpack plugin we wrote (see below).

[`aws-cli`](https://aws.amazon.com/fr/cli/) needs to be installed and [configured](https://docs.aws.amazon.com/fr_fr/cli/latest/userguide/cli-chap-configure.html) before continuing.

Last but not least, for Hot Reload, webpack-dev-server will create a Web Socket connection between the running widget & the process watching file changes on your local file system. Therefore you still need to have an HTTPS server running locally.

### 3.5.3. Configure your S3 settings

Copy+paste the file `webpack/webpack.config.dev.s3.template.js` in the same location, and rename the copy as `webpack/webpack.config.dev.s3.js`.

> Important: Make sure to **use this file name** so that
>
> - the application works as expected
> - this file is never committed to a repository [(Why?)](https://datree.io/secrets-management-aws/)

Edit the `webpack/webpack.config.dev.s3.js` configuration file:

```javascript
    {
        options: {
            accessKeyId: "your_AWS_AccessKeyId",
            secretAccessKey: "your_AWS_SecretAccessKey"
            region: "your_AWS_S3_bucket_region"
        },
        params: {
            Bucket: "your_bucket_name",
            ACL: "public-read", // don't change if you don't know
            Key: "path/to/your/bucket/folder"
        }
    }
```

### 3.5.4. Start debugging

> If you did set the `publicPath` variable during step [4.3.4. Start debugging](#4.3.4.-start-debugging), it's very important to reset it now:
>
> ```bash
>     $ npm config set widget-template-vue:publicPath ""
> ```

You can now start serving your widget through AWS S3:

```bash
    $ npm run startS3
```

You are ready to debug your widget executed on the cloud, with Hot Reload!

# 4. Start sharing

You've enhanced our template? Please open a merge request and we'll evaluate the opportunity to include your code in our template.
