const fs = require('fs');
const AWS = require('aws-sdk');
const Promise = require('bluebird');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
});

const DEFAULT_PARAMS = {
    Bucket: process.env.AWS_BUCKET,
};

module.exports = {
    uploadFile: ({ filePath, key }) => {
        console.log('filepath', filePath);
        const params = { ...DEFAULT_PARAMS, Body: fs.createReadStream(filePath), Key: key };
        return new Promise((resolve, reject) => {
            new AWS.S3().upload(params, (err, data) => {
                return err ? reject(err) : resolve(data);
            });
        });
    },

    fetchFile: filePath => {
        console.log('fetching from', filePath);
        const params = { ...DEFAULT_PARAMS, Key: filePath };
        return new Promise((resolve, reject) => {
            new AWS.S3().getObject(params, (err, data) => {
                return err ? reject(err) : resolve(data);
            });
        });
        r;
    },
};
