const router = require('express').Router();
const Utils = require('./utils/Utils');
const ffmpegUtils = require('./utils/ffmpegUtils');

router.get('/merge', (req, res, next) => {
    var { data } = req.body;

    if (!data || !data.length) {
        throw new Error('no data');
    }

    Promise.map(data, ([local, remote]) => {
        return Promise.all([
            Utils.downloadB64Data(local, `local-${Date.now()}`),
            Utils.downloadB64Data(remote, `remote-${Date.now()}`)
        ])
            .then(([localPath, remotePath]) => {
                return ffmpegUtils.merge(localPath, remotePath);
            })
            .then(outputPath => {
                // TODO: upload to s3
            })
            .then(s3Key => {
                return s3Key;
            });
    }).then(s3Files => res.apiResponse({ files: s3Files }));
});

module.exports = router;
