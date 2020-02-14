const layersCollection = require('../db').db().collection('layers')
const ObjectID = require('mongodb').ObjectID
const User = require('./User')
const Post = require('./Post')
const sanitizeHTML = require('sanitize-html')



let Layer = function(data, authorId, requestedPostId) {
    this.data = data
    this.errors = []
    this.authorId = authorId
    this.requestPostId = requestedPostId
}

Layer.prototype.cleanUp = function() {
 if(typeof (this.data.layerName) != 'string') {this.data.layerName = "" }
 if(typeof(this.data.floor) != 'string') {this.data.floor = ""}
if(typeof(this.data.images) != 'string') {this.data.images = ""}
    
        this.data = {
            
            layerName: this.data.layerName.trim(),
            floor: this.data.floor.trim()
        }
        
}

Layer.prototype.validate = function() {
    if (this.data.layerName == "") { this.errors.push("You must provide building name") }
    if (this.data.floor == "") { this.errors.push("You must provide a address for new building") }
}


Layer.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()
    })
}

module.exports = Layer