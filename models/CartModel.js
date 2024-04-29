const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user:{type:Schema.Types.ObjectId,ref:'User'},
    product:{type:Schema.Types.ObjectId,ref:'Product'},
    quantity:{type:Number,default:1},
    
})
module.exports = mongoose.model('Cart',CartSchema)