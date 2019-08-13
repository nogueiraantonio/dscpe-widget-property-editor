import { x3DDashboardUtils } from "./lib/widget";
import Vue from "vue";
import App from "./components/app.vue";
import vuetify from "./plugins/vuetify";
import { store } from "./store";

function start() {
    x3DDashboardUtils.disableCSS(true);

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
 * Assuming widget object has been loaded through widget-starter module
 */
export default function() {
    widget.addEvent("onLoad", () => {
        start();
    });
    widget.addEvent("onRefresh", () => {
        // what do you want to do on refresh ?
        // by default, lets reload the page
        window.location.reload();
    });
}
