const blogModel = require('../model/blogModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const ObjectId = require("mongoose").Types.ObjectId



//=============================================== Authentication <=============================================//

exports.authentication = async function(req, res, next){
  try {
    let token = req.headers["x-api-key"]
    if (!token) token = req.headers["X-Api-Key"]
    if (!token) return res.status(400).send({ status: false, msg: "Token is required" })
    try {
        decodeToken = jwt.verify(token, "functionUp-project1")
    } catch (err) {
        return res.status(401).send({ status: false, msg: "Error", error: err.message })
    }
    next()
} catch (err) {
    return res.status(500).send({ status: false, msg: "Error", error: err.message })
}
}



// =============================================== Authorization =======================================================//
exports.authorize = async function (req, res, next) {
  try {
    let blogId = req.params.blogId || req.query.authorId.category.tags.subcategory
    console.log(blogId)
    if (!blogId) return res.status(400).send({ status: false, msg: "blogId id is required to perform this action." })
    if (!ObjectId.isValid(blogId)) return res.status(400).send({ status: false, msg: "Not a valid blog id" })
    let getBlog = await blogModel.findById(blogId)
    if (!getBlog) return res.status(404).send({ status: false, msg: "Blog Not Found." })
    if (decodeToken.authorId.toString() !== getBlog.authorId.toString()) return res.status(403).send({ status: false, msg: "You are not authorize to perform the action." })
    next();
}
catch (err) {
    console.log(err.message)
    return res.status(500).send({ status: false, msg: "Error", error: err.message })
}
}

