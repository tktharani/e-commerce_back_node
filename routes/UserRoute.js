const express=require("express")
const router=express.Router()

const UserController=require("../controller/UserController")
router.get("/user/list",UserController.list)
router.post('/user/insert', UserController.insert);
router.delete('/user/:id',UserController.delete)
router.get("/users/:id", UserController.viewUser);
router.put("/user/:id",UserController.update)
module.exports = router