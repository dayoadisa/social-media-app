const postsCollection = require('../db').db().collection('posts')
const mongoose = require('mongoose')
const axios = require('axios');
const fs = require('fs');
const constants = require('./constants');
const login = require('./login');


const apiSchema = new mongoose.Schema({
    buildingID: Number,
    areaID: Number,
    alias: String,
    description: String,
    location: Array,
})

const apiData = mongoose.model('apiData', apiSchema)








fs.readFile(constants.tokenFilePath, { encoding: 'utf-8' }, (err, data) => {
    try {
        const tokenData = JSON.parse(data);

        if (tokenData.authorization) {
            return queryBuildings(tokenData.authorization)
        }

    } catch (e) {
        console.log('No token file')

    }

    if (err) {
        console.log('No token file')

    }
});



exports.queryBuildings = function(token) {
    // Start request buldings here
    const instance2 = axios.create({
        baseURL: constants.apiEndpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token

        }

    });

    instance2.get('/buildings').then((response) => {
        saveToken(response.headers)
        //console.log('>>> buildings', response.data)
        let buildingData = response.data

        postsCollection.insertMany(buildingData).then(item => {
            console.log(item)
            //postsCollection.createIndex({ location: 1 }, { unique: true });
        })
            .catch(err => {
                console.error(err)
            })

        postsCollection.createIndex({ buildingID: 1, areaID: 1, name: 1, location: 1 }, { unique: true }).then(item => {
            console.log(`Unique Index created successfully: ${item}`)
            //postsCollection.createIndex({ location: 1 }, { unique: true });
        })
            .catch(err => {
                console.error(err)
            })

    })
}

// save authorization and expiration to token.txt
function saveToken(headers) {
    const data = {
        authorization: headers.authorization,
        expires: headers.expires
    }
    //console.log(data)
    fs.writeFile(constants.tokenFilePath, JSON.stringify(data), () => { })
}