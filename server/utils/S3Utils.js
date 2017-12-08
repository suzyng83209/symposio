const AWS = require('aws-sdk');
const Promise = require('bluebird');

AWS.config.update({
    accessKeyId: process.env.awsAccessKeyId,
    secretAccessKey: process.env.awsSecretAccessKey,
    region: process.env.awsRegion
});

module.exports = {
    uploadFile: params => {
        return new Promise(function(resolve, reject) {
            new AWS.S3().upload(params, function(err, data) {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
};
