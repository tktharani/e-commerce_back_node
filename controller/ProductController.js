const Product=require("../models/ProductModel")
const{body,sanitizeBody,validationResult} =require("express-validator")
const multer = require('multer');
const path = require('path');



exports.list=[(req,res)=>{
    Product.find()
    .then((products)=>{
        return res.status(200).send(products)
    })
    .catch((err)=>{
        return res.status(200).send(err.message)
    })
}]

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/data/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const uploader = multer({ storage: storage });

exports.insertProduct = [
    uploader.single('uploaded_file'), // Multer middleware for single file upload
    body("name").isLength({ min: 1 }).withMessage("Name cannot be empty"),
    body("name").isAlpha().withMessage("Name cannot contain numbers or special characters"),
    body("description").isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),
    body("price").isNumeric().withMessage("Price must be numeric"),
    body("category").isAlpha().withMessage("Category can only contain letters"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Create a new Product instance with data from the request
            const product = new Product({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: req.file ? req.file.filename : null,
                category: req.body.category,
            });

            // Save the product to the database
            const savedProduct = await product.save();
            
            // Respond with success message and saved product data
            return res.status(200).json(savedProduct);
        } catch (err) {
            // Handle error and send appropriate response
            return res.status(500).json({ error: err.message });
        }
    }
];
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