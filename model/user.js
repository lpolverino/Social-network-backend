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
    followers:[{
        type:Object, require:true, properties:{
            _id:{type: Schema.Types.ObjectId, ref: "User", require:true},
            username: {type:String, require:true, maxlength:100},
        }
    }],
    following:[{
        type:Object, require:true, properties:{
            _id:{type: Schema.Types.ObjectId, ref: "User", require:true},
            username: {type:String, require:true, maxlength:100},
        }
    }],
    notifications: {type:Object, require:true, properties:{
        unread:{type:Boolean, require:true, default:false},
        notifications:[{type:Object, require:true, properties:{
            type:{type:String, require:true, enum:["Follow", "Post"]},
            content:{type:String, require:true},
            url:{type:String, required:true}
        }}]
    }},
    github_id:{type:String},
    github_image:{type:String},
})


module.exports = mongoose.model("User", UserSchema);