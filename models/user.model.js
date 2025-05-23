const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/miniProjectDataAssociation")


const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    age: Number,
    password: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model("user", userSchema)