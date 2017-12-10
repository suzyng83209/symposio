const router = require('express').Router();
const Promise = require('bluebird');
const auth = require('./auth');
const Utils = require('./utils/Utils');
const uploadFile = require('./utils/S3Utils').uploadFile;
const mergeAudio = require('./utils/ffmpegUtils').mergeAudio;

router.post('/upload', (req, res, next) => {
    var { data } = req.body;

    if (!data || !data.length) {
        throw new Error('no data');
    }

    return Promise.map(data, base64 => Utils.downloadB64Data(base64, `local-${Date.now()}.webm`), {
        concurrency: 1,
    })
        .then(arrayOfFilePaths =>
            Promise.map(arrayOfFilePaths, filePath =>
                uploadFile({ filePath, key: `local/${Date.now()}.webm` }),
            ),
        )
        .then(arrayOfS3Keys => {
            res.status(200).send({ s3Keys: arrayOfS3Keys });
        })
        .catch(next);
});

router.post('/merge', (req, res, next) => {
    var { data } = req.body;

    if (!data || !data.length) {
        throw new Error('no data');
    }

    var s3Keys = [];

    Promise.map(data, ([local, remote]) => {
        if (!local || !remote) {
            throw new Error('missing parameter: base64 data');
        }
        return Promise.all([Utils.downloadFile(local), Utils.downloadFile(remote)])
            .then(([localPath, remotePath]) => {
                console.log('***PATHS***: ', localPath, remotePath);
                const name = localPath.slice(localPath.lastIndexOf('/'));
                return Promise.all([mergeAudio(localPath, remotePath), name]);
                // TODO: 2. GENERATE TRANSCRIPT
            })
            .then(([combinedPath, key]) => uploadFile({ filePath: combinedPath, key }));
    })
        .then(s3Keys => res.status(200).send({ s3Keys }))
        .catch(next);
});

module.exports = router;
