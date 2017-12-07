import React from 'react';

export const isValidRoomId = roomId => {
    // only alphanumeric and dashes allowed
    if (!roomId) return true;
    return /^[A-zÀ-ÿ0-9|-]+$/.test(roomId);
};

export const searchToJSON = search => {
    var queryString = search.replace(/^\?/, '');
    var queryArray = queryString.split('&');
    var queryObject = queryArray.reduce((obj, query) => {
        var [key, value] = query.split('=');

        if (/^(true|false)$/.test(value)) {
            value = Boolean(value);
        }

        if (/^-?[0-9]+(\.[0-9]+)?$/.test(value)) {
            value = parseFloat(value);
        }

        obj[key] = value;
        return obj;
    }, {});
    return queryObject;
};

export const queryStringify = (data = {}) => {
    return (
        '?' +
        Object.keys(data)
            .map(key => `${key}=${JSON.stringify(data[key])}`)
            .join('&')
    );
};

export const withParams = Component => {
    const params = searchToJSON(window.location.search);
    return () => <Component params={params} />;
};
