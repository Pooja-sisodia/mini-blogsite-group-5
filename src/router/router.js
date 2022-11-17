const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")
const {authentication,authorize} = require("../middleware/auth")


router.post("/authors", authorController.createAuthor)

router.post("/blogs",authentication, blogController.createBlog)

router.get("/blogs",authentication,blogController.getBlogs)

router.put("/blogs/:blogId",authentication,authorize,blogController.updateBlog)

router.delete("/blogs/:blogId",authentication, authorize, blogController.deleted)

router.delete("/blogs",authentication, blogController.deleted)

router.post("/login", authorController.loginAuthor)






module.exports = router;