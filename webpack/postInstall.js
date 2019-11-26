const fs = require("fs");

const configFileName = "widget-config.js";
const configTemplateFileName = "webpack/widget-config-template.js";

try {
    if (fs.existsSync(configFileName)) {
        console.log(`✔️   ${configFileName} already exists, exiting \n \n`);
    } else if (!fs.existsSync(configFileName)) {
        fs.copyFile(configTemplateFileName, configFileName, err => {
            if (err) throw err;
            console.log(`✔️   default configuration created: ${configFileName}, please fill the file with your details \n \n`);
        });
    }
} catch (err) {
    console.error(err);
}
