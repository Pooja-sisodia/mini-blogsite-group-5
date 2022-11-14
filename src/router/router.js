const express = require('express');
const router = express.Router();
const authorController= require("../controller/authorController")
const blogController= require("../controller/blogController")


router.post("/create-author", authorController.createAuthor)
router.post("/create-blog", blogController.createBlog)



module.exports = router;