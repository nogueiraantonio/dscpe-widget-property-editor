const DELAY_BEFORE_RETRY = 200;
const MAX_NUMBER_OF_RETRY = 10;
/**
 * Mock the Widget Object normally provided by 3DDashboard
 */
const Widget = function() {
    const events = {};
    let title = "";

    const prefs = (() => {
        let prefsLocal = localStorage.getItem("_prefs_4_Widget_");
        if (prefsLocal) {
            try {
                prefsLocal = JSON.parse(prefsLocal);
            } catch {
                prefsLocal = {};
                localStorage.setItem("_prefs_4_Widget_", JSON.stringify(prefsLocal));
            }
        } else {
            prefsLocal = {};
            localStorage.setItem("_prefs_4_Widget_", JSON.stringify(prefsLocal));
        }
        return prefsLocal;
    })();

    const _savePrefsLocalStorage = () => {
        localStorage.setItem("_prefs_4_Widget_", JSON.stringify(prefs));
    };

    this.uwaUrl = "./";

    this.id = "standalone";

    this.addEvent = (event, callback) => {
        events[event] = callback;
        if (event === "onLoad") {
            if (document.readyState === "loading") {
                window.addEventListener("DOMContentLoaded", callback);
            } else {
                callback();
            }
        }
    };

    this.addPreference = pref => {
        // console.log(`Preference added ${pref}`);
        pref.value = pref.defaultValue;
        prefs[pref.name] = pref;
        _savePrefsLocalStorage();
    };

    this.getPreference = prefName => {
        return prefs[prefName];
    };

    this.getValue = prefName => {
        return prefs[prefName] === undefined ? undefined : prefs[prefName].value;
    };

    this.setValue = (prefName, value) => {
        prefs[prefName].value = value;
        _savePrefsLocalStorage();
    };

    this.setTitle = t => {
        title = t;
        document.title = title;
    };
    this.dispatchEvent = (...args) => {
        // console.debug(`Event received ${args}`);
    };
};

/**
 * Mock the UWA Object normally provided by 3DDashboard
 */
const UWA = function() {
    this.log = args => {
        /* eslint no-console:off */
        console.log(args);
    };
};

/**
 * Mock the libraries provided by 3DDashboard
 */
const initRequireModules = function() {
    define("DS/TagNavigatorProxy/TagNavigatorProxy", [], () => {
        const TagNavigatorProxy = function() {
            this.createProxy = () => {
                return {
                    addEvent: (name, event) => {},
                    setSubjectsTags: subject => {}
                };
            };
        };
        return new TagNavigatorProxy();
    });
    define("DS/PlatformAPI/PlatformAPI", [], () => {
        const PlatformAPI = function() {
            this.getUser = () => {
                return {
                    address: "An address for test purpose",
                    city: "VelizyLand",
                    email: "rogrigo@hotmail.com",
                    enabled: true,
                    firstname: "Rodrigo",
                    id: 7,
                    language: "en",
                    lastName: "Sanchez",
                    login: "RG0",
                    superUser: false,
                    telephone: "",
                    type: 3,
                    properties: {}
                };
            };
            this.subscribe = (topic, callback) => {
                return { topic, callback };
            };
        };
        return new PlatformAPI();
    });
};

const isWidget = !!window.UWA;
/**
 * Initialize the widget object
 * In Standalone mode :
 *      - Create the widget object with some (to be completed) API
 *      - Create the UWA object with some (to be completed) API
 *      - Load the requirejs library
 *      - Mock some 3DDashboard API (to be completed)
 * In case of 3DDashboard :
 *      - wait for the widget object to be inserted by the 3DDashboard
 */
export function initWidget(cbOk, cbError) {
    const waitFor = function(whatToWait, maxTry, then) {
        if (typeof window[whatToWait] !== "undefined") {
            then();
        } else if (maxTry === 0) {
            document.body.innerHTML = "Error while trying to load widget. See console for details";
            throw new Error(whatToWait + " didn't load");
        } else {
            setTimeout(waitFor, DELAY_BEFORE_RETRY, whatToWait, --maxTry, then);
        }
    };
    const loadRequire = () => {
        return new Promise((resolve, reject) => {
            const oReq = new XMLHttpRequest();
            oReq.addEventListener("load", resp => {
                const script = document.createElement("script"); // Make a script DOM node
                script.innerHTML = resp.target.response; // Set it's src to the provided URL
                document.head.appendChild(script);
                resolve();
            });
            try {
                oReq.open("GET", "static/lib/require.js");
                oReq.send();
            } catch (err) {
                reject(err);
            }
        });
    };
    const updatePublicPath = () => {
        __webpack_public_path__ = widget.uwaUrl.substring(0, widget.uwaUrl.lastIndexOf("/") + 1);
    };

    if (window.widget) {
        updatePublicPath();
        cbOk(widget);
    } else if (!window.UWA) {
        // outside of 3DDashboard
        window.widget = new Widget();
        window.UWA = new UWA();
        loadRequire().then(() => {
            initRequireModules();
        });
        waitFor("requirejs", MAX_NUMBER_OF_RETRY, () => {
            cbOk(window.widget);
        });
    } else {
        // in 3DDashboard
        try {
            // sometime (actually, often), dashboard takes time to inject widget object
            waitFor(
                "widget",
                MAX_NUMBER_OF_RETRY,
                // finally, ...starts
                () => {
                    updatePublicPath();
                    cbOk(widget);
                }
            );
        } catch (error) {
            console.error(error);
            cbError(error);
        }
    }
}

/**
 * Toolbox for 3DDashboard
 */
function Utils() {
    // List of path of the css files to deactivate with the following function
    const widgetDefaultStyleSheets = ["UWA/assets/css/iframe.css"];
    this.disableCSS = bDeactivate => {
        // Activate or deactivate widgets default css
        // To re-activate the Default CSS files pass a false boolean, if no parameters are passed it's considered as true
        let disableOptions = true;
        if (typeof bDeactivate === "boolean" && bDeactivate === false) {
            disableOptions = false;
        }
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            const sheet = styleSheets.item(i);
            for (const partialUrlToTest of widgetDefaultStyleSheets) {
                if (sheet.href && sheet.href.indexOf(partialUrlToTest) !== -1) {
                    sheet.disabled = disableOptions;
                }
            }
        }
    };
    this.isWidget = () => isWidget;
}

export const x3DDashboardUtils = new Utils();
