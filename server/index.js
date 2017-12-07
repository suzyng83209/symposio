const router = require('express').Router();
const Promise = require('bluebird');
const Utils = require('./utils/Utils');
const ffmpegUtils = require('./utils/ffmpegUtils');

router.post('/merge', (req, res, next) => {
    var { data } = req.body;

    if (!data || !data.length) {
        throw new Error('no data');
    }

    Promise.map(data, ([local, remote]) => {
        return Promise.all([
            Utils.downloadB64Data(local, `local-${Date.now()}.webm`),
            Utils.downloadB64Data(remote, `remote-${Date.now()}.webm`)
        ]).then(([localPath, remotePath]) => {
            console.log('***PATHS***: ', localPath, remotePath);
            ffmpegUtils.merge(localPath, remotePath);
            // TODO: 1. GENERATE TRANSCRIPT
            // TODO: 2. COMBINE WEBM
        }).then(() => {
            // TODO: 3. UPLOAD TO S3
        })
    })
        .then(() => res.status(200).send({ success: true }))
        .catch(next);
});

module.exports = router;
