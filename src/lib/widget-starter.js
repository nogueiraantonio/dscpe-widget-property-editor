import { initWidget } from "./widget";
import devtools from "@vue/devtools";

if (process.env.NODE_ENV === "development" && process.env.devVariables.USE_EXTERNAL_DEBUGGER) {
    // Ping devtools before trying to connect in order to avoid error message loop...
    fetch("http://localhost:8098/socket.io/")
        .then(() => devtools.connect())
        .catch(() => {
            /* eslint-disable no-console */
            console.warn("DevTools not started. Open another terminal, run \"npm run devtools\" and reload the widget to use them.");
            /* eslint-enable no-console */
        });
}

initWidget(widget => {
    widget.uwaPath = widget.uwaUrl.substring(0, widget.uwaUrl.lastIndexOf("/") + 1);
    import("../main").then(module => {
        module.default();
    });
});
