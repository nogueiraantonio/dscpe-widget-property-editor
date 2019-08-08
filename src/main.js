import Vue from "vue";
import { usingWidget, deactivateWidgetDefaultCss } from "./lib/widget";
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

    requirejs(["DS/PlatformAPI/PlatformAPI"], PlatformAPI => {
        store.commit("setMessage", "PlatformAPI ready.");
    });
}
/**
 * Entry point for both standalone & 3DDashboard modes
 */
usingWidget(
    widget => {
        widget.addEvent("onLoad", () => {
            console.log("object");
            start();
        });
        widget.addEvent("onRefresh", () => {
            // what do you want to do on refresh ?
            // by default, lets reload the page
            window.location.reload();
        });
    },
    error => {
        console.debug(`Error occured while mocking 3DDashboard : ${error}`);
    }
);
