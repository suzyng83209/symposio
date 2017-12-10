const router = require('express').Router();
const Promise = require('bluebird');
const auth = require('./auth');
const Utils = require('./utils/Utils');
const S3Utils = require('./utils/S3Utils');
const WatsonUtils = require('./utils/WatsonUtils');
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
                S3Utils.uploadFile({ filePath, key: `local/${Date.now()}.webm` }),
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
            })
            .then(([combinedPath, key]) => S3Utils.uploadFile({ filePath: combinedPath, key }));
    })
        .then(s3Keys => res.status(200).send({ s3Keys }))
        .catch(next);
});

router.get('/transcript', (req, res, next) => {
    var { localKey, remoteKey } = req.query;
    if (!localKey && !remoteKey) {
        throw new Error('no files specified for transcript generation.');
    }
    if (!remoteKey) {
        const fileName = localKey.replace(/^[a-zA-Z]+\//, '').replace(/.webm$/, '.txt');
        return S3Utils.fetchFile(localKey)
            .then(file => WatsonUtils.generateTranscript(file, { timestamps: false }))
            .then(WatsonUtils.massageTranscriptSolo)
            .then(data => Utils.writeTranscript(data, fileName))
            .then(filePath => S3Utils.uploadFile({ filePath, key: `transcripts/${fileName}` }))
            .then(s3Key => res.status(200).send(s3Key))
            .catch(next);
    }
    return Promise.all([
        S3Utils.fetchFile(localKey)
            .then(WatsonUtils.generateTranscript)
            .then(WatsonUtils.massageTranscript),
        S3Utils.fetchFile(remoteKey)
            .then(WatsonUtils.generateTranscript)
            .then(WatsonUtils.massageTranscript),
    ])
        .then(([localTranscript, remoteTranscript]) => {
            // merge the two somehow.
        })
        .then(console.log);
});

module.exports = router;
