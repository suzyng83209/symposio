const router = require('express').Router();
const Promise = require('bluebird');
const auth = require('./auth');
const Utils = require('./utils/Utils');
const S3Utils = require('./utils/S3Utils');
const EmailUtils = require('./utils/EmailUtils');
const WatsonUtils = require('./utils/WatsonUtils');
const mergeAudio = require('./utils/ffmpegUtils').mergeAudio;

router.post('/email/send', (req, res, next) => {
    var { data } = req.body,
        promise;

    if (!data) {
        throw new Error('no data');
    }

    return EmailUtils.send(data)
        .then(body => res.status(200).send(body))
        .catch(next);
});

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

    Promise.map(data, ([localKey, remoteKey]) => {
        if (!local || !remote) {
            throw new Error('missing parameter: file');
        }
        return Promise.all([Utils.downloadFile(local), Utils.downloadFile(remote)])
            .then(([localPath, remotePath]) => {
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

    const fileName = localKey.replace(/^[a-zA-Z]+\//, '').replace(/.webm$/, '.txt');
    var promise;

    if (!remoteKey) {
        promise = S3Utils.fetchFile(localKey)
            .then(file => WatsonUtils.generateTranscript(file, { timestamps: false }))
            .then(WatsonUtils.massageTranscriptSolo)
            .then(data => Utils.writeTranscript(data, fileName))
            .then(filePath => S3Utils.uploadFile({ filePath, key: `transcripts/${fileName}` }));
    } else {
        promise = Promise.all([
            S3Utils.fetchFile(localKey)
                .then(WatsonUtils.generateTranscript)
                .then(transcript => WatsonUtils.massageTranscript(transcript, { type: 'LOCAL' })),
            S3Utils.fetchFile(remoteKey)
                .then(WatsonUtils.generateTranscript)
                .then(transcript => WatsonUtils.massageTranscript(transcript, { type: 'REMOTE' })),
        ])
            .then(([localTranscript, remoteTranscript]) => {
                const combinedTranscript = localTranscript
                    .concat(remoteTranscript)
                    .sort((a, b) => a.startTime < b.startTime)
                    .reduce((transcript, part) => {
                        const line = `[${part.type}]: ${part.transcript}\n`;
                        return transcript.concat(line);
                    }, '');
                return Utils.writeTranscript(combinedTranscript, fileName);
            })
            .then(filePath => S3Utils.uploadFile({ filePath, key: `transcripts/${fileName}` }));
    }

    promise.then(s3Key => res.status(200).send(s3Key)).catch(next);
});

module.exports = router;
