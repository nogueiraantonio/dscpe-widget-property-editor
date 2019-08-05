import Vue from "vue";
import { loadWidget, deactivateWidgetDefaultCss } from "./lib/widget";
import App from "./components/app.vue";
import vuetify from "./plugins/vuetify";
import { store } from "./store";

function start() {
    deactivateWidgetDefaultCss(true);

    const mainComponent = new Vue({
        store,
        vuetify,
        render: h => h(App)
    });

    mainComponent.$mount("app");

    store.commit("setMessage", "Welcome !");
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
