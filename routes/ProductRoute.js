const express=require("express")
const router=express.Router()

const ProductController=require("../controller/ProductController")
router.post("/product/insert",ProductController.insert)
router.get("/product/list",ProductController.list)
router.delete("/product/:id",ProductController.delete)

module.exports = router