const fs = require("fs");

const localConfigurationFileName = "localConfig.js";

try {
    if (fs.existsSync(localConfigurationFileName)) {
        console.log("✔️   localConfig.js already exists, exiting \n \n");
    } else if (!fs.existsSync(localConfigurationFileName)) {
        fs.copyFile("webpack/localConfig.template.js", "localConfig.js", err => {
            if (err) throw err;
            console.log("✔️   localConfig.template.js was copied to localConfig.js, please fill the file with your details \n \n");
        });
    }
} catch (err) {
    console.error(err);
}
