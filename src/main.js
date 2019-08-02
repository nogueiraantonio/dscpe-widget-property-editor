import Vue from "vue";
import { loadWidget } from "./lib/widget";
import App from "./components/app.vue";
import vuetify from "./plugins/vuetify";
// import { store } from "./store";

function start() {
    const mainComponent = new Vue({
        vuetify,
        render: h => h(App)
    });

    mainComponent.$mount("app");

    // store.commit("setHost", widget.getValue("wsHost"));
}

loadWidget()
    .then(widget => {
        widget.addEvent("onLoad", () => {
            start();
        });
    })
    .catch(err => {
        console.error(`Error : ${err}`);
    });
