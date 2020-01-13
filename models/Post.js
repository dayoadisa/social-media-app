const postsCollection = require('../db').db().collection('posts')
const ObjectID = require('mongodb').ObjectID

let Post = function(data, userid) {
    this.data = data
    this.errors = []
    this.userid = userid
}

Post.prototype.cleanUp = function() {
    if (typeof(this.data.buildingName) != "string") {this.data.buildingName = ""}
    if (typeof(this.data.address) != "string") {this.data.address = ""}

    //get rid of bogus properties
    this.data = {
        buildingName : this.data.buildingName.trim(),
        address : this.data.address.trim(),
        createdDate : new Date(),
        author: ObjectID(this.userid)
    }
    
}

Post.prototype.validate = function() {
    if (this.data.buildingName == "") {this .errors.push("You must provide building name")}
    if (this.data.address == "") {this .errors.push("You must provide a address for new building")}
}

Post.prototype.create = function() {
    return new Promise( (resolve, reject) => {
        this.cleanUp()
        this.validate()
        if(!this.errors.length) {
            //save post into database
            postsCollection.insertOne(this.data).then(() => {
                resolve()
            }).catch(() => {
                this.errors.push("Please try again later")
                reject(this.errors)
            })
        } else {
            reject(this.errors)
        }
    })
}

Post.findSingleById = function(id) {
    return new Promise(async function(resolve, reject) {
      if (typeof(id) != "string" || !ObjectID.isValid(id)) {
        reject()
        return
      }
      let post = await postsCollection.findOne({_id: new ObjectID(id)})
      if (post) {
        resolve(post)
      } else {
        reject()
      }
    })
  }

module.exports = Post