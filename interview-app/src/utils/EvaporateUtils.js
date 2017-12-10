import Evaporate from 'evaporate';
import crypto from 'crypto';

export const initialize = (maxFileSize = null, progressInterval = 300) => {
    return Evaporate.create({
        signerUrl: config.baseUrl + '/api/sign_auth',
        aws_key: config.awsUploadAccessKeyId,
        awsRegion: config.awsRegion,
        bucket: bucket || config.s3Bucket,
        awsSignatureVersion: '4',
        computeContentMd5: true,
        logging: false, // verbosity
        maxFileSize: maxFileSize,
        progressIntervalMS: progressInterval, //the frequency (in milliseconds) at which progress events are dispatched
        cryptoMd5Method: function(data) {
            return window.AWS.util.crypto.md5(data, 'base64');
        },
        cryptoHexEncodedHash256: function(data) {
            return window.AWS.util.crypto.sha256(data, 'hex');
        },
    });
};
