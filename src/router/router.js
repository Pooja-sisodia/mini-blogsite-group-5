const express = require('express');
const router = express.Router();
const authorController=require("../controller/authorController")
const blogController= require("../controller/blogController")

router.post("/create-author", authorController.authorRegister)
router.post("/create-blog", blogController.createBlog)
router.get("/blogs",blogController.getBlog)


module.exports = router;