const express = require('express');
const router = express.Router();
const authorController=require("../controller/authorController")
const blogController= require("../controller/blogController")
const auth = require("../middleware/auth")

router.post("/blogs", auth.Authentication, blogController.createBlog)
router.post("/authors", authorController.authorRegister)
router.get("/blogs", auth.Authentication, blogController.getBlog)
router.put("/blogs/:blogId", auth.Authentication, auth.Authorization, blogController.updateBlog)
router.delete("/blogs/:blogId",auth.Authentication, auth.Authorization, blogController.deleted)
router.delete("/blogs", auth.Authentication, auth.Authorization, blogController.Qdeleted)
router.post("/login", authorController.loginAuthor)


module.exports = router;