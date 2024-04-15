const User=require("../models/UserModel")
const{body,sanitizeBody,validationResult} =require("express-validator")


exports.list=[(req,res)=>{
    User.find()
    .then((users)=>{
        return res.status(200).send(users)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}]
exports.insert=[
    body("username").isLength({min:1}).withMessage("UserName cannot be empty"),
    body("email").isEmail().withMessage("Invalid Email format"),
    body("password").isLength({min:6}).withMessage("password must be alteast 6 character"),
    body("fullName").isAlpha().withMessage("name is only letters"),
    body('role').isIn(['admin', 'user']).withMessage('Role must be either admin or user'),

   
    
    (req,res)=>{

        const errors =validationResult(req)
        if(!errors.isEmpty()){
            res.status(200).send(errors.array())
        }
        else{
            const user= new User({
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                fullName:req.body.fullName,
                role:req.body.role
            })
            user.save()
            .then((user)=>{
                return res.status(200).send(user)
            })
            .catch((err)=>{
                return res.status(200).send(err.message)
            })
        }
    
}]

exports.delete=(req,res)=>{
    const userId=req.params.id;
    User.findByIdAndDelete(userId)
    .then((deletedUser)=>{
        return res.status(200).send("User deleted sucessfully..")
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}

exports.viewUser = (req, res) => {
    const userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send("User not found");
        }
        return res.status(200).send(user);
      })
      .catch((err) => {
        return res.status(500).send(err.message);
      });
  };

  exports.update = [(req,res)=>{
    
        User.updateOne(
        {_id:req.params.id},
        {$set:{
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            fullName:req.body.fullName,
            role:req.body.role
        }}
    )
    .then((user)=>{
        return res.status(200).send(user)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}]