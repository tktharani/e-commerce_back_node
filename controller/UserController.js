const User=require("../models/UserModel")

exports.list=[(req,res)=>{
    User.find()
    .then((users)=>{
        return res.status(200).send(users)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}]
exports.insert=[(req,res)=>{
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