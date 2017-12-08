const router = require('express').Router();
const Promise = require('bluebird');
const uploadFile = require('./utils/S3Utils').uploadFile;
const mergeAudio = require('./utils/ffmpegUtils').mergeAudio;
const downloadB64Data = require('./utils/Utils').downloadB64Data;

router.post('/upload', (req, res, next) => {
    var { data } = req.body;

    if (!data || !data.length) {
        throw new Error('no data');
    }

    return Promise.map(data, base64 => downloadB64Data(base64, `local-${Date.now()}.webm`), {
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
        return Promise.all([
            downloadB64Data(local, `local-${Date.now()}.webm`),
            downloadB64Data(remote, `remote-${Date.now()}.webm`),
        ])
            .then(([localPath, remotePath]) => {
                console.log('***PATHS***: ', localPath, remotePath);
                return Promise.all([localPath, remotePath, mergeAudio(localPath, remotePath)]);
                // TODO: 2. GENERATE TRANSCRIPT
            })
            .then(([local, remote, combined]) =>
                Promise.all([
                    uploadFile({ filePath: local, key: `local/${Date.now()}.webm` }),
                    uploadFile({ filePath: remote, key: `remote/${Date.now()}.webm` }),
                    uploadFile({ filePath: combined, key: `combined/${Date.now()}.webm` }),
                ]),
            )
            .then(arrayOfKeys => {
                arrayOfKeys.map(key => s3Keys.push(key));
                return arrayOfKeys;
            });
    })
        .then(arrayOfS3Keys => res.status(200).send({ s3Keys: arrayOfS3Keys, s3Keys_flat: s3Keys }))
        .catch(next);
});

module.exports = router;
