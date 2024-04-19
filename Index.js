const express=require("express")
const app=express();
const cors = require('cors');



app.use(express.json())
const router=express.Router()

const mongoose=require("mongoose")

const PORT = process.env.PORT || 5000
const MONGODB_URL="mongodb://localhost/productdatabase"

mongoose.connect(MONGODB_URL)
    .then(()=>{
        console.log(`${MONGODB_URL} connection Sucessfully....`)
    })
    .catch((err)=>{
        console.error("Error in connecting to mongodb",err.message)
    })
    // external middleware
    app.use(cors({
        origin:"*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }));

    app.use("/public",express.static(__dirname+"/public"))

    // Example route to serve the images
    app.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, 'public', 'data', 'uploads', filename));
  });
    app.use(router)
    const productRouter=require("./routes/ProductRoute")
    app.use(productRouter)
    
     const userRouter=require("./routes/UserRoute")
     app.use(userRouter)

    // app.use(require("./controller/UserController"))

app.listen(PORT,()=>{
    console.log(`server listening on ${PORT}....`)
})