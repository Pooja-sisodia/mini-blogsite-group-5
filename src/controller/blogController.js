const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const mongoose = require ("mongoose");



// VALIDATION
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Create Blog>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

const createBlog = async function (req, res) {

    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "body should not be empty" })
        }
        if (!isValid(data.title)) return res.status(400).send({ status: false, msg: "title is Required" })
        if (!isValid(data.body)) return res.status(400).send({ status: false, msg: "body is Required" })
        if (!isValid(data.authorId)) return res.status(400).send({ status: false, msg: "authorId is Required" })
        if (!isValidObjectId(data.authorId)) return res.status(400).send({ status: false, msg: "author id must have 24 digits" })
        if (!isValid(data.category)) return res.status(400).send({ status: false, msg: "category is Required" })

        let Id = data.authorId
        let authorId = await authorModel.findById(Id)
        if (!authorId) {
            return res.status(404).send({ status: false, msg: "authorid is not valid" })
        } 
        let savedData = await blogModel.create(data)
        res.status(201).send(savedData)
    } catch (error) {
        return res.status(500).send({ msg: error.message })

    }
}