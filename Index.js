const express=require("express")
const app=express();
const cors = require('cors');
app.use(express.json())
const router=express.Router()

const mongoose=require("mongoose")

const PORT = process.env.PORT || 6000
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
        origin:"*"
    }));
    app.use(router)
    const productRouter=require("./routes/ProductRoute")
    app.use(productRouter)

app.listen(PORT,()=>{
    console.log(`server listening on ${PORT}....`)
})