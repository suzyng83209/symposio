const router = require('express').Router();
const Promise = require('bluebird');
const Utils = require('./utils/Utils');
const ffmpegUtils = require('./utils/ffmpegUtils');

router.pose('/upload', (req, res, next) => {
    var { data } = req.body;

    if (!data || !data.length) {
        throw new Error('no data');
    }

    S3Utils.upload(data);
});

router.post('/merge', (req, res, next) => {
    var { data } = req.body;

    if (!data || !data.length) {
        throw new Error('no data');
    }

    Promise.map(data, ([local, remote]) => {
        var _local, _remote, _combined;
        return Promise.all([
            Utils.downloadB64Data(local, `local-${Date.now()}.webm`),
            Utils.downloadB64Data(remote, `remote-${Date.now()}.webm`),
        ])
            .then(([localPath, remotePath]) => {
                _local = localPath;
                _remote = remotePath;
                console.log('***PATHS***: ', localPath, remotePath);
                var promise = remotePath
                    ? ffmpegUtils.merge(localPath, remotePath)
                    : Promise.resolve();
                return promise;
                // TODO: 2. GENERATE TRANSCRIPT
            })
            .then(combinedPath => {
                _combined = combinedPath;

                return Promise.map([
                    S3Utils.upload(_local),
                    S3Utils.upload(_remote),
                    S3Utils.upload(_combined),
                ]);
                // TODO: 3. UPLOAD TO S3 || Google Cloud Storage
            })
            .then(s3Key => {
                return s3Key;
            });
    })
        .then(() => res.status(200).send({ success: true }))
        .catch(next);
});

module.exports = router;
