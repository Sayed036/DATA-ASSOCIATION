const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    post: String,
    
}, {timestamps: true})

module.exports = mongoose.model("post", postSchema)