import $ from 'jquery';

function checkNested(obj /*, level1, level2, ... levelN*/) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
        if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
}

export default {
    load(files, globalObject) {
        // constructs the globalObject to check its nested keys agains the window
        globalObject = globalObject.split('.');
        globalObject.unshift(window);

        files = Array.isArray(files) ? files : [files];

        console.log('[BaseService load]');
        return new Promise(function(resolve, reject) {
            if (checkNested.apply(this, globalObject)) {
                // API already loaded, resolve immediatly
                console.log(`${globalObject} already loaded`);
                return resolve();
            }

            var promises = files.map(file => {
                let remoteFile =
                    file.indexOf('/') === 0
                        ? (file = '//' + window.location.host + '/services' + file)
                        : file;
                return $.ajax({ type: 'GET', url: remoteFile, dataType: 'script', cache: true });
            });

            return Promise.all(promises).then(
                function() {
                    if (!checkNested.apply(this, globalObject)) {
                        return reject(new Error(`${globalObject} Object not accessible!`));
                    } else {
                        return resolve();
                    }
                },
                function(error) {
                    console.error(`${globalObject} Service load error`);
                    throw error;
                }
            );
        });
    }
};
