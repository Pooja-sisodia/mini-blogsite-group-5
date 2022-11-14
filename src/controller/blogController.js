const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const mongoose = require ("mongoose");
const validator = require("../validator/validator")


/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Create Blog>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

//=====================This function is used for Creating a Blog=====================//
const CreateBlog = async function (req, res) {
    try {
        let data = req.body;
        let { title, authorId, category, subcategory, body, tags } = data


        //=====================Checking the validation=====================//
        if (!(title && authorId && category && body))
            return res.status(400).send({ status: false, msg: "Please fill the Mandatory Fields." });

        //=====================Validation of Title=====================//
        if (!isValid(title))
            return res.status(400).send({ status: false, message: "Please enter Blog Title." });

        //=====================Validation of Blog Body=====================//
        if (!isValid(body))
            return res.status(400).send({ status: false, message: "Please enter Blog Body." });

        //=====================Validation of Tags=====================//
        if (!isValid(tags))
            return res.status(400).send({ status: false, message: "Please enter Blog Tags." });

        //=====================Validation of Category=====================//
        if (!isValid(category))
            return res.status(400).send({ status: false, message: "Please enter Blog Category." });

        //=====================Validation of Subcategory=====================//
        if (!isValid(subcategory))
            return res.status(400).send({ status: false, message: "Please enter Subcategory of The Blog." })


        //=====================Validation of AuthorId=====================//
        if (!(/^[a-f\d]{24}$/i).test(authorId)) { return res.status(400).send({ status: false, message: "Please enter Correct AuthorID." }) }
        let authorData = await authorModel.findById(authorId);
        if (!authorData) return res.status(404).send({ status: false, msg: "Author not found." });


        //===================== Checking given AuthorID Whether It is You or Not! =====================//
        if (authorId) {
            if (authorId !== req.token.Payload.UserId) {
                return res.status(403).send({ status: false, message: "You can't create someone else!! Please use your Own AuthorID." });
            }
        }

        //===================== Checking given Published is True or False inside Body. Then publishedAt will Update the Current Date & Time When You Create Blog =====================//
        if (req.body.isPublished == true) {
            req.body.publishedAt = DATE
        }

        //===================== Creation of Blog =====================//
        if (!checkTitle) {
            if (title === checkTitle.title) {
                return res.status(400).send({ status: false, message: "Same Given Title already Exist!! You Should give another Title." });
            }
            let createBlog = await blogModel.create(data);
            return res.status(201).send({ status: true, data: createBlog });
        }

    } catch (error) {

        res.status(500).send({ error: error.message })
    }
}
