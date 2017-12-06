const Promise = require('bluebird');

var array = [];

for (var i = 1; i < 11; i++) {
    array.push([i, -i]);
}

console.log(array);

Promise.map(
    array,
    num => {
        var [positive, negative] = num;
        console.log('Running map on', positive);
        var promise1 = Promise.resolve(positive);
        var promise2 = Promise.resolve(negative);
        return Promise.all([promise1, promise2]).then(values => {
            var [plus, minus] = values;
            return plus * minus;
        });
    },
    { concurrency: 2 }
).then(console.log);
