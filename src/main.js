import Vue from "vue";
import { init3DDashboardMocking } from "./lib/widget";
import App from "./components/app.vue";
import vuetify from "./plugins/vuetify";
import { store } from "./store";

function start() {
    const mainComponent = new Vue({
        store,
        vuetify,
        render: h => h(App)
    });

    mainComponent.$mount("app");

    requirejs(["DS/PlatformAPI/PlatformAPI"], PlatformAPI => {
        store.commit("setMessage", "PlatformAPI ready");
    });
}
/**
 * Entry point for both standalone & 3DDashboard modes
 */
init3DDashboardMocking(
    widget => {
        widget.addEvent("onLoad", () => {
            start();
        });
        widget.addEvent("onRefresh", () => {
            // what do you want to do on refresh ?
            // by default, lets reload the page
            window.location.reload();
        });
    },
    error => {
        console.log(`Error occured while mocking 3DDashboard : ${error}`);
    }
);
