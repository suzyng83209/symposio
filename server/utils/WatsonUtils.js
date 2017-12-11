var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var stream = require('stream');

const MAX_FILE_SIZE = 100 * 1024 * 1024; //100 Mb
const CODES = {
    1000: { error: false, message: 'The connection closed normally.' },
    1002: {
        error: true,
        message: 'The service is closing the connection due to a protocol error.',
    },
    1006: { error: true, message: 'The connection was closed abnormally.' },
    1009: { error: true, message: 'The frame size exceeded the 4 MB limit.' },
    1011: {
        error: true,
        message:
            'The service is terminating the connection because it encountered an unexpected condition that prevents it from fulfilling the request.',
    },
};
const PARAMS = {
    model: 'en-US_BroadbandModel',
    content_type: 'audio/webm',
    interim_results: false,
    word_confidence: false,
    profanity_filter: false,
    smart_formatting: true,
    max_alternatives: 0,
    timestamps: true,
};

const generateTranscript = function(file, params) {
    return new Promise((resolve, reject) => {
        try {
            var speechToText = new SpeechToTextV1({
                username: process.env.WATSON_USERNAME,
                password: process.env.WATSON_PASSWORD,
            });
        } catch (err) {
            console.log('speechToText config err: ', err);
            return reject(err);
        }

        var recognizeStream = speechToText.createRecognizeStream({ ...PARAMS, ...params });

        if (file.ContentLength > MAX_FILE_SIZE) {
            reject('file size greater than 100 Mb: ' + file.ContentLength / 1024 / 1024);
        }

        try {
            var bufferStream = new stream.PassThrough();
            bufferStream.end(file.Body);
            bufferStream.pipe(recognizeStream);
            console.log('[TRANSCRIPT] - Creating');
        } catch (e) {
            console.log('stream creation err: ', e);
            return reject(e.message);
        }

        var response;

        recognizeStream.on('error', err => {
            console.log('watson transcript generation error: ', err);
            reject(err);
        });
        recognizeStream.on('results', data => {
            response = data;
        });
        recognizeStream.on('close', code => {
            console.log('handle close', code);
            var res = handleWatsonClose(Number(code));
            return res.error ? reject(res.message) : resolve(response.results);
        });
    });
};

const massageTranscriptSolo = results => {
    console.log('[TRANSCRIPT] - Massaging Solo');
    return results.reduce((transcript, part) => {
        return transcript.concat(part.alternatives[0].transcript).concat('\n');
    }, '');
};

const massageTranscript = (results, options) => {
    console.log('[TRANSCRIPT] - Massaging');
    return results.map(({ alternatives }) => {
        const { timestamps = [], transcript } = alternatives[0];
        return {
            ...options,
            transcript,
            startTime: timestamps[0][1],
            endtime: timestamps[timestamps.length - 1][1],
        };
    });
};

const handleWatsonClose = code =>
    CODES[code]
        ? CODES[code]
        : { error: true, message: 'unhandled watson code, check watson api version' };

module.exports = { generateTranscript, massageTranscriptSolo, massageTranscript };
