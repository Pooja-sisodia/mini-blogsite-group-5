const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const mongoose = require("mongoose")
const ObjectId = require("mongoose").Types.ObjectId



const isValid = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { return false }
    if (typeof (value) === "string" && (value).trim().length > 0) { return true }
}

const isArray = function (value) {  // this is a function to check if the input is an array or not
    if (typeof (value) === "object") {
        value = value.filter(x => x.trim())
        if (value.length == 0) return false
        else return true
    }
}

const isValidId = function (authorId) {
    return mongoose.Types.ObjectId.isValid(authorId);
};
const isValidRequest = function (request) {
    return (Object.keys(request).length > 0)
}



//====================================================================================================
exports.createBlog = async function (req, res) {
    try {
        let data = req.body
        
        // checking if data is empty
        if (Object.keys(data) == 0){
            return res.status(400).send({ status: false, msg: "Bad request. Content to post missing" })}

        let {title , body , authorId, category, subcategory, tags}= data


        if (!isValid(authorId)) return res.status(400).send({ status: false, msg: 'please provide authorId' })
        if (!isValidId(authorId)) return res.status(400).send({ status: false, msg: 'authorId is invalid' })

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

exports.getBlogs = async function (req, res) {
    try {
        let data = req.query
        if (!data) return res.status(400).send({ status: false, msg: "Please provide details in query" })
        let getBlog = await blogModel.find({ isPublished: true, isDeleted: false })
        if (!getBlog) return res.status(404).send({ status: false, msg: "No blog found" })
        return res.status(200).send({ satus: true, msg: getBlog })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}


exports. updateBlog = async function (req, res) {
    try {
        const requestBody = req.body
        const blogId = req.params.blogId
        const authorToken = req.authorId

        // ID validation
        if (!ObjectId.isValid(blogId)) return res.status(400).send({ status: false, msg: "Not a valid BLOG ID" })
        // if (!ObjectId.isValid(authorToken)) return res.status(400).send({ status: false, msg: "Not a valid author id from token." })
        // Id verification
        const blogDetails = await blogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null })
        if (!blogDetails) return res.status(404).send({ status: false, msg: "Blog not found." })

        // if (blogDetails.authorId.toString() != authorToken) return res.status(403).send({ status: false, message: "Unauthorize Access." })
        if (!isValidRequest(requestBody)) return res.status(400).send({ status: false, message: "No input by user for update." })

        const { title, body, tags, category, subcategory, isPublished } = requestBody
        const updatedBlog = {}

        if (isValid(title)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlog, '$set'))
                updatedBlog['$set'] = {}
            updatedBlog['$set']['title'] = title
        }

        if (isValid(body)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlog, '$set'))
                updatedBlog['$set'] = {}
            updatedBlog['$set']['body'] = body
        }

        if (isValid(category)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlog, '$set'))
                updatedBlog['$set'] = {}
            updatedBlog['$set']['category'] = category
        }

        if (isValid(isPublished)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlog, '$set'))
                updatedBlog['$set'] = {}
            updatedBlog['$set']['isPublished'] = isPublished
            updatedBlog['$set']['publishedAt'] = isPublished ? new Date() : null
        }

        if (isValid(tags)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlog, '$addToSet'))
                updatedBlog["$addToSet"] = {}
            if (Array.isArray(tags)) {
                updatedBlog['$addToSet']['tags'] = { $each: [...tags] }
            }
            if (typeof tags === 'string') {
                updatedBlog['$addToSet']['tags'] = tags
            }
        }

        if (isValid(subcategory)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlog, '$addToSet'))
                updatedBlog["$addToSet"] = {}
            if (Array.isArray(subcategory)) {
                updatedBlog['$addToSet']['subcategory'] = { $each: [...subcategory] }
            }
            if (typeof subcategory === 'string') {
                updatedBlog['$addToSet']['subcategory'] = subcategory
            }
        }

        const validUpdatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, updatedBlog, { new: true })
        res.status(200).send({ status: true, message: "Updated Succesfully", data: validUpdatedBlog })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}


exports. deleted = async function (req, res) {
    try {
        //Validate: The blogId is present in request path params or not.
        let blog_Id = req.params.blogId
        if (!blog_Id) return res.status(400).send({ status: false, msg: "Blog Id is required" })

        //Validate: The blogId is valid or not.
        let blog = await blogModel.findById(blog_Id)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })

        //Validate: If the blogId is not deleted (must have isDeleted false)
        let is_Deleted = blog.isDeleted
        if (is_Deleted == true) return res.status(404).send({ status: false, msg: "Blog is already deleted" })

        //Delete a blog by changing the its isDeleted to true.
        let deletedBlog = await blogModel.findOneAndUpdate({ _id: blog_Id },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        //Sending the Deleted response after updating isDeleted : true
        return res.status(200).send({ status: true, msg: "Blog deleted succesfully" })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        return res.status(500).send({ status: false, msg: " Server Error", error: err.message })
    }
}


exports. deleteByQuery = async function (req, res) {
    try {
        const data = req.query
        const category = req.query.category
        const authorId = req.query.authorId
        const tagName = req.query.tags
        const subcategory = req.query.subcategory
        const isPublished = req.query.isPublished


        //check if the query field is empty
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Enter the details of blog that you would like to delete" })

        //check if data already deleted or not
        const findDeleted = await blogModel.findOne(data)
        if (findDeleted.isDeleted == true) return res.status(404).send({ status: false, message: "blog is already deleted" })

        //finding document using query params
        const delectingBlog = await blogModel.updateMany({ $or: [{ category: category }, { authorId: authorId }, { tags: tagName }, { subcategory: subcategory }, { isPublished: isPublished }] },
            { $set: { isDeleted: true, deletedAt: new Date() } })


        if (delectingBlog == null) return res.status(404).send({ status: false, message: "Blog not found" })


        return res.status(200).send({ status: true, message: "Blog has been deleted" })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

