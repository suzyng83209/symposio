var crypto = require('crypto');

const hmac = (key, value) =>
    crypto
        .createHmac('sha256', key)
        .update(value)
        .digest();

const hexhmac = (key, value) =>
    crypto
        .createHmac('sha256', key)
        .update(value)
        .digest('hex');

module.exports.sign = function(req, res) {
    const datetime = req.query.datetime;
    const to_sign = req.query.to_sign;

    if (!datetime || !to_sign) {
        throw new Error('parameters invalid');
    }
    const timestamp = datetime.substr(0, 8);

    const date = hmac('AWS4' + process.env.AWS_SECRET_KEY, timestamp);
    const region = hmac(date, process.env.AWS_REGION);
    const service = hmac(region, 's3');
    const signing = hmac(service, 'aws4_request');

    res.send(hexhmac(signing, to_sign));
};
