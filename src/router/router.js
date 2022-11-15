const express = require('express');
const router = express.Router();
const authorController=require("../controller/authorController")
const blogController= require("../controller/blogController")


router.post("/create-author", authorController.authorRegister)
router.post("/create-blog", blogController.createBlog)
router.post("/authors", authorController.authorRegister)
router.post("/blogs", blogController.createBlog)
router.get("/blogs",blogController.getBlog)
router.put("/blogs/:blogId",blogController.updateBlog)
router.delete("/blogs/:blogId",blogController.deleted)
router.delete("/blogs", blogController.Qdeleted)





module.exports = router;