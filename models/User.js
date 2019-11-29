const bcrypt = require('bcryptjs')
const usersCollection = require('../db').db().collection('users')
const validator = require('validator')

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function() {
    if(typeof(this.data.username) != 'string') {this.data.username = ''}
    if(typeof(this.data.email) != 'string') {this.data.email = ''}
    if(typeof(this.data.password) != 'string') {this.data.password = ''}

    //get rid of bogus properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {
        if (this.data.username == '') {this.errors.push("You must provide a username.")}
        if (this.data.username != '' && !validator.isAlphanumeric(this.data.username)) {this.errors.push("username can only contain letters and numbers.")}
        if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}
        if (this.data.password == '') {this.errors.push("You must provide a password.")}
        if (this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push("password must be atleast 12 characters.")}
        if (this.data.password.length > 50) {this.errors.push('passwords cannot exceed 50')}
        if (this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("username must be atleast 3 characters.")}
        if (this.data.username.length > 30) {this.errors.push('username cannot exceed 30')}
    
        //Only if username is valid then check if username is taken
        if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
            let usernameExists = await usersCollection.findOne({username: this.data.username})
            if(usernameExists) {this.errors.push("That username has already been taken")}
        }
    
        //Only if email is valid then check if email is taken
        if (validator.isEmail(this.data.email)) {
            let emailExists = await usersCollection.findOne({email: this.data.email})
            if(emailExists) {this.errors.push("Email has already been taken")}
        }
        resolve()
    })
}
User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                resolve("congrats!!!")
                } else {
                reject("invalid username or password")
                    }
        }).catch(function() {
            reject("Please try again later")
        })
    })

}

User.prototype.register = function() {
   return new Promise(async (resolve, reject) => {
    //validate user data
    this.cleanUp()
    await this.validate()

    //if there are no validation errors
    //save users to database
    if (!this.errors.length) {
        //hash users passwords
        let salt = bcrypt.genSaltSync(10)
        this.data.password = bcrypt.hashSync(this.data.password, salt)
        await usersCollection.insertOne(this.data)
        resolve()
    } else {
        reject(this.errors)
    }
})
}
module.exports = User