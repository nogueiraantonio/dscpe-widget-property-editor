// Setup Webpack public path to avoid loading issues with static assets
const setupPublicPathForDashboard = () => {
    const frameUrl = window.location.href;
    let startUwaUrl = frameUrl.indexOf("uwaUrl=");
    if (startUwaUrl !== -1) {
        startUwaUrl += "uwaUrl=".length;
        let extractUwaUrl = frameUrl.substring(startUwaUrl, frameUrl.indexOf("&", startUwaUrl));
        extractUwaUrl = decodeURIComponent(extractUwaUrl);
        extractUwaUrl = extractUwaUrl.substring(0, extractUwaUrl.lastIndexOf("/") + 1);
        // Finally setup the public path
        __webpack_public_path__ = extractUwaUrl;
    }
};
setupPublicPathForDashboard();

const Widget = function() {
    let events = {};
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
        // console.debug(`Event recieved ${args}`);
    };
};

const UWA = function() {
    this.log = args => {
        /* eslint no-console:off */
        console.log(args);
    };
};

const waitFor = function(whatToWait, maxTry, then) {
    if (typeof window[whatToWait] !== "undefined") {
        then();
    } else if (maxTry === 0) {
        document.body.innerHTML = "Error while trying to load widget. See console for details";
        throw new Error(whatToWait + " didn't load");
    } else {
        setTimeout(waitFor, 200, whatToWait, --maxTry, then);
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

const initRequireModules = function() {
    define("DS/TagNavigatorProxy/TagNavigatorProxy", [], () => {
        console.log("initing");
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
                return { topic: topic, callback: callback };
            };
        };
        return new PlatformAPI();
    });
};

export function usingWidget(cbOk, cbError) {
    if (window.widget) cbOk(window.widget);
    else if (!window.UWA) {
        // outside of 3DDashboard
        window.widget = new Widget();
        window.UWA = new UWA();
        loadRequire().then(() => {
            initRequireModules();
        });
        waitFor("requirejs", 10, () => {
            cbOk(window.widget);
        });
    } else {
        // in 3DDashboard
        try {
            // sometime (actually, often), dashboard takes time to inject widget object
            waitFor(
                "widget",
                10,
                // finally, ...starts
                () => {
                    cbOk(window.widget);
                }
            );
        } catch (error) {
            console.error(error);
            cbError(error);
        }
    }
}

// List of path of the css files to deactivate with the following function
const widgetDefaultStyleSheets = ["UWA/assets/css/iframe.css"];

export function deactivateWidgetDefaultCss(bDeactivate) {
    // Activate or deactivate widgets default css
    // To re-activate the Default CSS files pass a false boolean, if no parameters are passed it's considered as true
    let disableOptions = true;
    if (typeof bDeactivate === "boolean" && bDeactivate === false) {
        disableOptions = false;
    }
    let styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
        const sheet = styleSheets.item(i);
        for (const partialUrlToTest of widgetDefaultStyleSheets) {
            if (sheet.href && sheet.href.indexOf(partialUrlToTest) !== -1) {
                sheet.disabled = disableOptions;
            }
        }
    }
}
