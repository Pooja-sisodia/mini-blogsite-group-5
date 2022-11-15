const express = require('express');
const router = express.Router();
const authorController=require("../controller/authorController")
const blogController= require("../controller/blogController")


router.post("/authors", authorController.authorRegister)
router.post("/blogs", blogController.createBlog)
router.get("/blogs",blogController.getBlog)





module.exports = router;