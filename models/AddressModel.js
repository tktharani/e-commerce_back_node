const mongoose=require('mongoose');
const Schema=mongoose.Schema
const addressSchema=new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true,minlength: 5, maxlength: 10 },
    country: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', unique: true } // Reference to User schema, unique for one-to-one
    
})
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;