import { x3DDashboardUtils } from "./lib/widget";
import Vue from "vue";
import App from "./components/app.vue";
import vuetify from "./plugins/vuetify";
import { store } from "./store";

export let service3DSpaceUrl = null;
export let documentPropertiesMap = null;
let baseUrl = null;
let myWidgetVueApp = null;

function getBaseUrl (_w) {
    let _baseUrl;
    try {
        _baseUrl = _w.uwaUrl.substring(0, _w.uwaUrl.lastIndexOf("/") + 1);
    } catch (error) {
        _baseUrl = "./";
    }
    return _baseUrl;
}

const interruptMs = 1000;
const timeOutIntervalMS = 30000;

function waitForMountToComplete(callback, _vue, ct) {
    console.debug("waitForMountToComplete ct = " + ct);

    if ((!_vue._isMounted) && ((ct * interruptMs) < timeOutIntervalMS)) {
        setTimeout(waitForMountToComplete(callback, ct + 1), interruptMs);
    } else {
        callback();
    }
}

function preProcessAuthorizedValues(propsArray) {
    try {
        for (let i = 0; i < propsArray.length; i++) {
            const testProp = propsArray[i];

            if (!Object.prototype.hasOwnProperty.call(testProp, "props")) {
                continue;
            }

            for (let j = 0; j < testProp.props.length; j++) {
                const propObject = testProp.props[j];

                if (!Object.prototype.hasOwnProperty.call(propObject, "authorizedValues")) {
                    continue;
                }

                if (!Object.prototype.hasOwnProperty.call(propObject, "parentKey")) {
                    const parsedAuthorizedValues = [];
                    const rawAuthorizedValues = propObject.authorizedValues;
                    rawAuthorizedValues.forEach((rawAuthorizedValue) => {
                        parsedAuthorizedValues.push({ text: rawAuthorizedValue, value: { key: propObject.key, val: rawAuthorizedValue }, disabled: false });
                    });
                    propObject.authorizedValues = parsedAuthorizedValues;
                } else {
                    const rawAuthorizedKeys = Object.keys(propObject.authorizedValues);
                    rawAuthorizedKeys.forEach((key) => {
                        const parsedAuthorizedValues = [];
                        const rawAuthorizedValues = propObject.authorizedValues[key];
                        rawAuthorizedValues.forEach((rawAuthorizedValue) => {
                            parsedAuthorizedValues.push({ text: rawAuthorizedValue, value: { key: propObject.key, val: rawAuthorizedValue }, disabled: false });
                        });
                        propObject.authorizedValues[key] = parsedAuthorizedValues;
                    });
                }
            }
        }
    } catch (err) {
        console.error(err);
    }

    return propsArray;
}

function start() {
    requirejs(["DS/i3DXCompassServices/i3DXCompassServices",
    "DS/DataDragAndDrop/DataDragAndDrop"],
    (i3DXCompassServices, DataDragAndDrop) => {
        "use strict";

        x3DDashboardUtils.disableCSS(true);

        console.debug("WCAE: initializing...");

        baseUrl = getBaseUrl(widget);

        fetch(baseUrl + "/config")
            .catch(err => console.debug(err))
            .then(response => {
                // console.log("WCAE: Receiving data from json");
                // console.log(response);
                return response.json();
            })
            .catch(err => console.debug(err))
            .then(data => {
                // console.log("WCAE: data retrieved");
                // console.log ("WCAE: data =" + JSON.stringify(data));

                console.debug("WCAE: Property array fetched ...");

                documentPropertiesMap = preProcessAuthorizedValues(data.items);

                i3DXCompassServices.getServiceUrl({
                    serviceName: "3DSpace",
                    platformId: widget.getValue("x3dPlatformId"),
                    onComplete: URLResult => {
                        service3DSpaceUrl = URLResult;

                        if (myWidgetVueApp === null) {
                            myWidgetVueApp = new Vue({
                                store,
                                vuetify,
                                render: h => h(App),
                                // eslint-disable-next-line vue/order-in-components
                                methods: {
                                    getApp: function() {
                                        return this.$children[0];
                                    },
                                    reset: function() {
                                        this.$store.commit("documentUnloaded");

                                        this.getApp().getDocumentEditor().reset();
                                    }
                                }
                            });
                        } else { //reset
                            myWidgetVueApp.reset();
                        }

                        const myWidget = {

                            getTypeAndId: (dragObject, index) => {
                                // todo: throw malformed expected data
                                if (!Object.prototype.hasOwnProperty.call(dragObject, "data")) return null;

                                const dragData = dragObject.data;

                                // todo: throw malformed expected data
                                if (!Object.prototype.hasOwnProperty.call(dragData, "items")) return null;

                                const dragDataItems = dragData.items;

                                // todo: throw malformed expected data
                                if (!Array.isArray(dragDataItems)) return null;

                                if (dragDataItems.length === 0) return null;

                                if (index < 0) return null; // Todo
                                if (index > dragDataItems.length - 1) return null;

                                const dragDataItem = dragDataItems[index];

                                if (
                                !Object.prototype.hasOwnProperty.call(dragDataItem, "objectId") ||
                                !Object.prototype.hasOwnProperty.call(dragDataItem, "objectType")
                                ) { return null; }

                                return [dragDataItem.objectType, dragDataItem.objectId];
                            }
                        };

                        console.debug("_isMounted = ", myWidgetVueApp._isMounted);
                        myWidgetVueApp.$mount("app");

                        waitForMountToComplete(() => {
                             console.debug("Mounted...");
                             const docEditorContainer = widget.body.querySelector("#app");

                             DataDragAndDrop.droppable(docEditorContainer, {
                                drop: function (data) {
                                    // docEditorContainer.value = data; ????

                                    const dataJson = JSON.parse(data);

                                    const typeAndId = myWidget.getTypeAndId(dataJson, 0);

                                    if (typeAndId === null) return;

                                    const objectType = typeAndId[0];
                                    const objectId = typeAndId[1];

                                    const docEditor = myWidgetVueApp.getApp().getDocumentEditor();

                                    docEditor.load(objectType, objectId);
                                }
                            });
                        }, myWidgetVueApp);//, 15000);
                    },
                    onFailure: err => {
                        console.error(err);
                    }
                });

                window.title = "DS CPE Document Editor";
                widget.setTitle(window.title);
        });
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
        // TODO an application data refresh
        // meaning only refresh dynamic content based on remote data, or after preference changed.
        // we could reload the frame [ window.location.reload() ], but this is not a good practice, since it reset preferences
        start();
    });
}
