const Product=require("../models/ProductModel")
const{body,sanitizeBody,validationResult} =require("express-validator")




exports.list=[(req,res)=>{
    Product.find()
    .then((products)=>{
        return res.status(200).send(products)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}]

exports.insert =[
    body("name").isLength({min:1}).withMessage("name cannot be empty"),
    body("name").isAlphanumeric().withMessage("Name cannot be aplhanumeric"),
    body("description").isLength({min:10}).withMessage("Description can be more than 10 letters"),
    body("price").isNumeric().withMessage("Price is only numeric"),
    body("category").isAlpha().withMessage("category is only letters"),

    (req,res)=>{
        const errors =validationResult(req)
        if(!errors.isEmpty()){
            res.status(200).send(errors.array())
        }
        else{
            const product=new Product({
                name:req.body.name,
                description:req.body.description,
                price:req.body.price,
                image:req.body.image,
                category:req.body.category,
        
            })
            product.save()
            .then((product)=>{
                return res.status(200).send(product)
            })
            .catch((err)=>{
                return res.status(200).send(err.message)
            })
        }
   
}]

exports.delete=(req,res)=>{
    const productId=req.params.id;
    Product.findByIdAndDelete(productId)
    .then((deletedProduct)=>{
        // return res.status(200).send(deletedProduct)
        return res.status(200).send("product deleted sucessfully")


    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })

}

exports.update = [(req,res)=>{
    
    Product.updateOne(
        {_id:req.params.id},
        {$set:{
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            image:req.body.image,
        }}
    )
    .then((product)=>{
        return res.status(200).send(product)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}]