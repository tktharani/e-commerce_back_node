var mongoose=require("mongoose")

var Schema=mongoose.Schema;
var UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String },
    phonenumber:{type:Number},
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address: { type: Schema.Types.ObjectId, ref: 'Address' }, // Reference to Address schema
    cart:{type:mongoose.Schema.Types.ObjectId,ref:'Cart'},// Reference to Cart schema
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }], // Reference to Payment schema
  
},{timestamps:true});

module.exports = mongoose.model("User",UserSchema)