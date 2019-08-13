import { initWidget } from "./widget";

initWidget(widget => {
    import("../main").then(module => {
        module.default();
    });
});
