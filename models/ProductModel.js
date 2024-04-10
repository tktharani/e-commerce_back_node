var mongoose=require("mongoose")

var Schema=mongoose.Schema;

var ProductSchema = new Schema({
    name:{type:String,required:true},
    description:{type:String,requried:true},
    price:{type:Number,requried:true,default:0.0},
    image:{type:String,requried:true}
},{timestamps:true});

module.exports = mongoose.model("Product",ProductSchema);