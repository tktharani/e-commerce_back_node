const Product=require("../models/ProductModel")

exports.list=[(req,res)=>{
    Product.find()
    .then((products)=>{
        return res.status(200).send(products)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}]

exports.insert =[(req,res)=>{
    const product=new Product({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:req.body.image

    })
    product.save()
    .then((product)=>{
        return res.status(200).send(product)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
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