const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const mongoose = require("mongoose");

/*================================================validating=========================================================== */

const isValid= function(value){
    if(typeof (value) === undefined || typeof (value) === null) {return false}
    if(typeof (value) === "string" && (value).trim().length>0) {return true}
}

const isArray= function(value){
    if (typeof (value) === "object") {
        value = value.filter(x => x.trim())
        if (value.length == 0) return false
        else return true
    }
}

/*================================================creatingBlog=========================================================== */

const createBlog = async function (req, res) {
    try {
        let data = req.body
        
        // checking if data is empty
        if (Object.keys(data) == 0){
            return res.status(400).send({ status: false, msg: "Bad request. Content to post missing" })}

        let {title , body , authorId, category, subcategory, tags}= data


        let idMatch = await authorModel.findById(authorId)
        // id match in author model, if not
        if (!idMatch){
            return res.status(404).send({ status: false, msg: "No such author present in the database" })}

        if (!isValid(authorId)) return res.status(400).send({ status: false, msg: 'please provide authorId' })

        if (!isValid(title)) return res.status(400).send({ status: false, msg: 'please provide title' })

        if (!(category)) return res.status(400).send({ status: false, msg: 'please provide category' })

        if (!isValid(body)) return res.status(400).send({ status: false, msg: 'please provide body' })

        if (!isArray(subcategory)) return res.status(400).send({ status: false, msg: 'please provide subcategory' })

        if (!isArray(tags)) return res.status(400).send({ status: false, msg: 'please provide tags' })

        let savedData = await blogModel.create(data)
        //creating entry in db with status 201 success!
        return res.status(201).send({ status: true, msg: savedData })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}

 /*===============================================================getBlog================================================================*/

const getBlogs = async function (req, res) {
    try {
        let data = req.query
        if (!data) return res.status(400).send({ status: false, msg: "Please provide details in query" })
        let getBlog = await blogModel.find({ isPublished: true, isDeleted: false, ...data })
        if (!getBlog) return res.status(404).send({ status: false, msg: "No blog found" })
        return res.status(200).send({ satus: true, msg: getBlog })
    }
    catch (error) {
        res.status(500).send({ error: error.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlogs

