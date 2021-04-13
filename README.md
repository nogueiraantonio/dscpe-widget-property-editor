<!-- markdownlint-disable MD001 MD024 -->

# Widget Template with Vue, VueX & Vuetify

## Installation

### Get the sources

You can download the [template zip](https://btcc.s3-eu-west-1.amazonaws.com/widget-lab/templates/widget-template-vue.zip) and unzip it wherever you prefer.

### Install the development dependencies

Open a terminal in the location you've put the downloaded / cloned sources, then:

```bash
npm install
```

### Start the Widget

```bash
npm start
```

## All commands

| Command            | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `npm run start`    | Build app continuously and serve @ `http://localhost:8081/widget` |
| `npm run startS3`  | Build app continuously to `/dist/` and serve through AWS S3       |
| `npm run build`    | Build app to `/dist/`                                             |
| `npm run devtools` | Open the devtools                                                 |
| `npm run lint`     | Run ESLint                                                        |
| `npm run lintFix`  | Run ESLint and fix issues                                         |
