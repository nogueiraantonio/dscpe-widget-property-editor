const fs = require("fs");

const localConfigurationFile = "./localConfig.js";

try {
    if (fs.existsSync(localConfigurationFile)) {
        console.log("localConfig.js already exists, exiting");
    } else if (!fs.existsSync(localConfigurationFile)) {
        fs.copyFile("localConfig.template.js", "localConfig.js", err => {
            if (err) throw err;
            console.log("localConfig.template.js was copied to localConfig.js, please fill the file with your details");
        });
    }
} catch (err) {
    console.error(err);
}
