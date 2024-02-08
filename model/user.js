const mongoose = require("mongoose");

const Schema = mongoose.Schema

const UserSchema = new Schema({
    user_name:{type:String, require:true , maxlength:100 },
    password:{type:String, require:true},
    email:{type:String, require:true, maxlength:100} ,
    about:{type:String, maxlength:500},
    image:{type:String},
    birt_date:{type: Date},
    sing_date:{type: Date, default: new Date()},
    followers:[{type: Schema.Types.ObjectId, ref: "User", require:true}],
    following:[{type: Schema.Types.ObjectId, ref: "User", require:true}],
})


module.exports = mongoose.model("User", UserSchema);