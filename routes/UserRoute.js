const express=require("express")
const router=express.Router()
const { body, validationResult } = require("express-validator");

const UserController=require("../controller/UserController")

// Validation middleware for user registration
const validateUserRegistration = [
    body("username").isLength({ min: 1 }).withMessage("Username cannot be empty"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 3 }).withMessage("Password must be at least 6 characters"),
    body("fullName").isAlpha().withMessage("Full name should only contain letters"),
    body("phonenumber").isMobilePhone().withMessage("Invalid phone number format"),
];

router.get("/user/list",UserController.list)
router.post('/user/insert',validateUserRegistration, UserController.registerUser);
router.post('/user/login', UserController.loginUser);
router.delete('/user/:id',UserController.delete)
router.get("/user/:id", UserController.viewUser);
router.put("/user/:id",UserController.update)

// New route to fetch user's address
router.get("/user/address/:id", UserController.getUserAddress);

// Update user's address
router.put('/user/address/:id', UserController.updateUserAddress);



module.exports = router