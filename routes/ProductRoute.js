const express=require("express")
const router=express.Router()

const ProductController=require("../controller/ProductController")
router.post("/product/upload",ProductController.insertProduct)
router.get("/product/list",ProductController.list)
router.delete("/product/:id",ProductController.delete)
router.put("/product/:id",ProductController.update)
router.get("/products/:id", ProductController.viewProduct);


module.exports = router