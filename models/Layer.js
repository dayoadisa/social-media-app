const layersCollection = require('../db').db().collection('layers')
const ObjectID = require('mongodb').ObjectID
const User = require('./User')
const Post = require('./Post')
const sanitizeHTML = require('sanitize-html')



let Layer = function(data, userid, requestedPostId) {
    this.data = data
    this.errors = []
    this.userid = userid
  
    this.requestPostId = requestedPostId
}

Layer.prototype.cleanUp = function() {
 if(typeof (this.data.layerName) != 'string') {this.data.layerName = "" }
 if(typeof(this.data.floor) != 'string') {this.data.floor = ""}
if(typeof(this.data.images) != 'string') {this.data.images = ""}
    
        this.data = {
            name: this.data.name,
            address: this.data.address,
            layerName: this.data.layerName.trim(),
            floor: this.data.floor.trim(),
            images: this.data.images,
            createdDate: new Date(),
            author: ObjectID(this.userid),
            coordinates: this.data.coordinates
        }
        
}

Layer.prototype.validate = function() {
    if (this.data.layerName == "") { this.errors.push("You must provide floor name") }
    if (this.data.floor == "") { this.errors.push("You must provide floor number") }
}


Layer.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()

        if (!this.errors.length) {
            //save post into database
            layersCollection.insertOne(this.data).then((info) => {
                resolve(info.ops[0]._id)
            }).catch(() => {
                this.errors.push("Please try again later")
                reject(this.errors)
            })
        } else {
            reject(this.errors)
        }
    })
}

Layer.reusablePostQuery = function (uniqueOperations) {
    return new Promise(async function (resolve, reject) {
        let aggOperations = uniqueOperations.concat([
            { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "authorDocument" } },
            {
                $project: {
                    name: 1,
                    address: 1,
                    layerName: 1,
                    floor: 1,
                    images: 1,
                    createdDate: 1,
                    coordinates: 1,
                    authorId: "$author",
                    author: { $arrayElemAt: ["$authorDocument", 0] }
                }
            }
        ])
        let layers = await layersCollection.aggregate(aggOperations).toArray()

        //clean up author property in each post object
        layers = layers.map(function (layer) {

            

            layer.author = {
                username: layer.author.username,
                //avatar: new User(post.author, true).avatar

            }

            return layer
            console.log(layer)
        })

        resolve(layers)
    })
}


Layer.findSingleById = function (id) {
    return new Promise(async function (resolve, reject) {
        if (typeof(id) != "string" || !ObjectID.isValid(id)) {
            reject()
            return
        }

        let layers = await Layer.reusablePostQuery([
            { $match: { _id: new ObjectID(id) } }
        ])

        if (layers.length) {
            console.log(layers[0])
            resolve(layers[0])
        } else {
            reject()
        }
    })
}


Layer.findByAuthorId = function (authorId) {
    return Layer.reusablePostQuery([
        { $match: { author: authorId } },
        { $sort: { createdDate: -1 } }
    ])
}


module.exports = Layer