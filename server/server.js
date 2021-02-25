//Dependencies declarations
const express = require('express');
const cors = require("cors");
const path = require ('path')
const fs = require('fs');

//initialization
const app = express();
const corsOpts = {  origin: true };

app.use (cors(corsOpts));

app.use('/', express.static(`${__dirname}/../dist`));

//app.get('/', (req, res) => { res.send("Hello World - 12.18.0"); } );
app.get ('/config',  (req, res) => {
    let propData = JSON.parse(fs.readFileSync(path.join( __dirname, './config/props.json')));
    return res.send(propData);
  })

const port = process.env.PORT || 4999;

app.set('port', port);
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
