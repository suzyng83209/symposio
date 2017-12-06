require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird');

const app = express();

const Utils = require('./Utils');
const ffmpeg = require('./ffmpeg');

app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'interview-app/build')));

// routes
app.get('/api/merge', (req, res) => {
    var { data } = req.body;

    if (!data || !data.length) {
        throw new Error('no data');
    }

    data.map(b64Tuple => { // [...,[local, remote],...]
        Promise.map(b64Tuple, (b64Data, i) => {
            return Utils.downloadB64Data(b64Data, `${i ? 'remote' : 'local'}-${Date.now()}`);
        }).then(([localPath, remotePath]) => {
            ffmpeg.merge(localPath, remotePath);
        });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/interview-app/build/index.html'));
});

const port = process.env.PORT || 9000;
app.listen(port);

console.log(`app listening on ${port}`);
