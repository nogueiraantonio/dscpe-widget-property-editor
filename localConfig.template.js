const fs = require("fs");

module.exports = {
    devServer: {
        https: {
            key: fs.readFileSync("path/to/mkcert/files/localhost+3-key.pem"),
            cert: fs.readFileSync("path/to/mkcert/files/localhost+3.pem"),
            ca: fs.readFileSync("path/to/mkcert/files/rootCA.pem")
        }
    }
};
