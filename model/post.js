const mongoose =require("mongoose")

const Schema = mongoose.Schema


const PostSchema = new Schema({
    author:{type: Schema.Types.ObjectId , ref:"User", required:true},
    content:{type: String, required:true, maxLength:1000},
    date:{type:Date, default: new Date()},
    likes:{type:Object, properties:{
        total: {type:Number, default:0},
        likes:[{type: Schema.Types.ObjectId, ref: "User", required:true}]
    }},
    comments:[{type: Schema.Types.ObjectId, ref:"Comment", required:true}],
    image: {type:String, default:""}
})

module.exports = mongoose.model("Post", PostSchema)