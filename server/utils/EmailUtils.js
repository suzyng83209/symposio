const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_KEY,
    domain: process.env.BASE_URL,
});

const DATA = {
    from: `Interviewer <admin@${process.env.BASE_URL}`,
    subject: 'Your Interview is waiting',
};

const send = data => {
    const messageData = { ...DATA, data };
    return new Promise((resolve, reject) => {
        mailgun.messages().send(messageData, (err, body) => {
            return err ? reject(err) : resolve(body);
        });
    });
};

module.exports = {
    send,
};
