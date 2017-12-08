import AWSService from '../services/AWSService';

const AWS_BUCKET = 'symposio-audio-assets';
const AWS_REGION = 'us-east-1';
const IDENTITY_POOL_ID = 'us-east-1:bea12fb5-6687-4857-a8c0-89e160843db1';

var AWSController = {
    _initialized: false,
    _instance: null,

    initialize() {
        if (AWSController._initialized) {
            return Promise.resolve();
        }

        return AWSService.load().then(() => {
            window.AWS.config.update({
                region: AWS_REGION,
                credentials: new window.AWS.CognitoIdentityCredentials({
                    IdentityPoolId: IDENTITY_POOL_ID,
                }),
            });

            this._instance = new window.AWS.S3({
                apiVersion: '2006-03-01',
                params: { Bucket: AWS_BUCKET },
            });
        });
    },

    upload(file, type = 'local') {
        return new Promise((resolve, reject) =>
            this._instance.upload(
                {
                    Key: type + '/' + file.name,
                    Body: file,
                    ACL: 'public-read',
                },
                (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                },
            ),
        );
    },
};

export default AWSController;
