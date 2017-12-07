require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const serverRoutes = require('./server');

const app = express();

app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'interview-app/build')));

// routes
app.get('/ping', (_, res) => {
    console.log('pinged');
    res.status(200).send('Symposium v0.1');
});
app.use('/api', serverRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/interview-app/build/index.html'));
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`app listening on ${port}`);
});
