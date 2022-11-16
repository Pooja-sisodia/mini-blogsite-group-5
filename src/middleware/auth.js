const blogModel = require('../model/blogModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const ObjectId = require("mongoose").Types.ObjectId

// =============> Authentication <================================
// exports.authentication = async function(req, res, next){
//   try {
//     let token = req.headers["x-api-key"]
//     if (!token) token = req.headers["X-Api-Key"]
//     if (!token) return res.status(400).send({ status: false, msg: "Token is required" })
//     try {
//         decodeToken = jwt.verify(token, "functionUp-project1")
//     } catch (err) {
//         return res.status(401).send({ status: false, msg: "Error", error: err.message })
//     }
//     next()
// } catch (err) {
//     return res.status(500).send({ status: false, msg: "Error", error: err.message })
// }
// }


exports.authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        //If no token is present in the request header return error. This means the user is not logged in.
        if (!token){
            return res.status(400).send({ status: false, msg: "token must be present" });
        }
        jwt.verify(token, "functionUp-project1",(error,decodedToken)=>{
            if(error){
                return res.status(401).send({status:false,message:"token is not valid"})
            }
            req.authorId = decodedToken.authorId
            //Set an attribute in request object 
            next();
        })
       
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, msg: error.message })
    }
};

// =============> Authorization <================================
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

// exports.Authorization = async function (req, res, next) {
//     try {
//         if (req.params.blogId) {
//             let blogId = req.params.blogId
//             if(!mongoose.isValidObjectId(blogId)){return res.status(400).send({ status: false, msg: "blogId is not in format"})}
//             // let author = await blogModel.findById(blogId)
//             // if(!author){
//             //     return res.status(400).send({ status: false, msg: "blogId is invalid"})
//             // }
//             // if (author.authorId._id.toString() !== req.authorId) {
//             //     return res.status(403).send({ status: false, msg: "You are not authorized" })
//             // }
//             next()
//         }
//         else if(Object.keys(req.query).length == 0){
//             return res.status(403).send({ Status: false, msg: "You are not authorized provide some details in either in path param or query param" })
//         }
//         else if(req.query) {
//             if(req.query.isPublished=== 'true'){
//                 req.query.isPublished = true
//             }
//             else if(req.query.isPublished=== 'false'){
//                 req.query.isPublished = false
//             }
//             let findauthorid = await blogModel.find(req.query).select({ authorId: 1, _id: 0 })
//             if(findauthorid.length==0){
//                 return res.status(400).send({status:false,msg:"No document found with given filter"})
//             }
//             else{
//                 for(let i = 0; i<findauthorid.length ; i++){
//                     if(findauthorid[i].authorId._id.toString() == req.authorId){
//                         return next()
//                     }
//                 }
//                 return res.status(403).send({ Status: false, msg: "You are not authorized" })
//             }
//         }
        
//     }
//     catch (error) {
//         res.status(500).send({ status: false, msg: error.message })
//     }
// }
