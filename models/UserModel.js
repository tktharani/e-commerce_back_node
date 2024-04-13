var mongoose=require("mongoose")

var Schema=mongoose.Schema;
var UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
},{timestamps:true});

module.exports = mongoose.model("User",UserSchema)