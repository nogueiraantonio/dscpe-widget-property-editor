const express = require("express");

// testing scope object
let testing = {
    baseurl: undefined,
    server: undefined,
    delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

function runServer(port, dir) {
    return new Promise(resolve => {
        const app = express();
        app.use("/", express.static(dir));
        let srv = app.listen(port, function() {
            testing.baseurl = "http://localhost:" + port + "/";
            console.debug("Web server running ", testing.baseurl);
            resolve(srv);
        });
    });
}

// open browser
before(async function() {
    testing.server = await runServer(8666, "dist");
});

// close browser and reset global variables
after(async function() {
    testing.server.close();
});

// push testing to global execution scope
global.testing = testing;
