const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const mongoose = require("mongoose")


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


//====================================================================================================
const createBlog = async function (req, res) {
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

const getBlogs = async function (req, res) {
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


const updateBlog = async function (req, res) {
    try {
        //Validate: The blogId is present in request path params or not.
        let blog_Id = req.params.blogId  // in database only id is present not blogId so how id is getting matched with blogId it is because of the name of the variable in the router.js
        if (!blog_Id) return res.status(400).send({ status: false, msg: "Blog Id is required" })

        //Validate: The blogId is valid or not.
        let blog = await blogModel.findById(blog_Id)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })

        //Validate: If the blogId exists (must have isDeleted false)
        let is_Deleted = blog.isDeleted
        if (is_Deleted == true) return res.status(404).send({ status: false, msg: "Blog is already deleted" })

        //Updates a blog by changing the its title, body, adding tags, adding a subcategory.
        let Title = req.body.title
        let Body = req.body.body
        let Tags = req.body.tags
        let Subcategory = req.body.subcategory

        if (!Title) {
            if (!isValid(Title)) return res.status(400).send({ status: false, msg: 'please provide title' })
        }
        if (!Subcategory) {
            if (!isValid(Subcategory)) return res.status(400).send({ status: false, msg: 'please provide subcategory' })
        }
        if (!Tags) {
            if (!isValid(Tags)) return res.status(400).send({ status: false, msg: 'please provide tags' })
        }
        if (!Body) {
            if (!isValid(Body)) return res.status(400).send({ status: false, msg: 'please provide body' })
        }


        let updatedBlog = await blogModel.findOneAndUpdate({ _id: blog_Id },
            {
                $set: { title: Title, body: Body, isPublished: true, publishedAt: new Date() },
                $addToSet: { subcategory: Subcategory, tags: Tags }
            }, { new: true })
        //Sending the updated response
        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        return res.status(500).send({ status: false, msg: " Server Error", error: err.message })
    }
}


const deleted = async function (req, res) {
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


const deleteByQuery = async function (req, res) {
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

// module.exports.createBlog = createBlog
module.exports.getBlog = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleted = deleted
module.exports.Qdeleted = deleteByQuery
module.exports.createBlog = createBlog
module.exports.getBlog = getBlogs
