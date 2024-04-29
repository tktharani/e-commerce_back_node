const express=require("express")
const router=express.Router()
const verifyToken=require("../middleware/UserMiddleware")

const CartController =require("../controller/CartController")
router.post("/add-to-cart",verifyToken,CartController.addToCart)//add
router.put("/update-cart",verifyToken,CartController.updateCart)//update
router.delete("/remove-from-cart/:id",verifyToken,CartController.removeFromCart)//delete
router.delete("/clear-cart",verifyToken,CartController.clearCart)
router.get("/get-cart",verifyToken,CartController.getCart)


module.exports = router