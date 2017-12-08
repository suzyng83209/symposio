import BaseService from './BaseService';

export default {
    load() {
        var jsFiles = ['https://sdk.amazonaws.com/js/aws-sdk-2.163.0.min.js'];

        return BaseService.load(jsFiles, 'AWS').then(() => {
            return window.AWS;
        });
    },
};
