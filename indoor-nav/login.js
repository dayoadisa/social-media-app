const axios = require('axios');
const fs = require('fs');
const constants = require('./constants');

// Fetch token from textfile
fs.readFile(constants.tokenFilePath, { encoding: 'utf-8' }, (err, data) => {
    try {
        const tokenData = JSON.parse(data);
        if (!tokenData.authorization) {
            return requestToken()
        }
    } catch (e) {
        console.log('No token file')
        requestToken();
    }

    if (err) {
        requestToken();
    }
});


function requestToken() {
    console.log('>>> Indoor nav request new token')
    const instance1 = axios.create({
        baseURL: constants.apiEndpoint,
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': constants.xApiKey
        }
    });

    instance1.post('/login')
        .then(function (response) {
            saveToken(response.headers)
        })
        .catch(function (error) {
            console.log('>>> Failed login::', error.message);
        })
}


// save authorization and expiration to token.txt
function saveToken(headers) {
    const data = {
        authorization: headers.authorization,
        expires: headers.expires
    }
    console.log(data)
    fs.writeFile(constants.tokenFilePath, JSON.stringify(data), () => { })
}
