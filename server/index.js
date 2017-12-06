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
            // return ffmpegUtils.merge(localPath, remotePath);
        });
        // .then(outputPath => {
        //     // TODO: upload to s3
        // })
        // .then(s3Key => {
        //     return s3Key;
        // });
    })
        .then(() => res.status(200).send({ success: true }))
        .catch(next);
});

module.exports = router;
