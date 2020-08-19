import { initWidget } from "./widget";

initWidget(widget => {
    widget.uwaPath = widget.uwaUrl.substring(0, widget.uwaUrl.lastIndexOf("/") + 1);
    import("../main").then(module => {
        module.default();
    });
});
