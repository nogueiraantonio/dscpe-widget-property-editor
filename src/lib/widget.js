const Widget = function() {
    let events = {};
    let title = {};
    let prefs = {};

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
    };

    this.getValue = prefName => {
        return prefs[prefName] === undefined ? undefined : prefs[prefName].value;
    };

    this.setValue = (prefName, value) => {
        prefs[prefName].value = value;
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
        // console.warn("Waiting for " + whatToWait);
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

export function init3DDashboardMocking(cbOk, cbError) {
    if (!window.UWA) {
        window.widget = new Widget();
        window.UWA = new UWA();
        loadRequire().then(() => {
            initRequireModules();
        });
        waitFor("requirejs", 30, () => {
            cbOk(window.widget);
        });
    } else {
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
            cbError(error);
        }
    }
}
