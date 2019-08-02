const Widget = function() {
    let events = {};
    let title = {};
    let prefs = {};

    this.uwaUrl = "./";

    this.addEvent = (event, callback) => {
        events[event] = callback;

        if (event === "onLoad") {
            window.addEventListener("load", function() {
                callback();
            });
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
        console.warn("Waiting for " + whatToWait);
        setTimeout(waitFor, 100, whatToWait, --maxTry, then);
    }
};

/* const initRequireModules = function() {
    define("DS/TagNavigatorProxy/TagNavigatorProxy", [], () => {
        return new (function() {
            this.createProxy = () => {
                return {
                    addEvent: (name, event) => {},
                    setSubjectsTags: subject => {}
                };
            };
        })();
    });
    define("DS/PlatformAPI/PlatformAPI", [], () => {
        return new (function() {
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
        })();
    });
}; */

export function loadWidget() {
    return new Promise((resolve, reject) => {
        if (!window.UWA) {
            window.widget = new Widget();
            window.UWA = new UWA();
            return resolve(window.widget);
        } else {
            try {
                // sometime (actually, often), dashboard takes time to inject widget object
                waitFor(
                    "widget",
                    10,
                    // finally, ...starts
                    function() {
                        resolve(window.widget);
                    }
                );
            } catch (error) {
                reject(error);
            }
        }
    });
}
