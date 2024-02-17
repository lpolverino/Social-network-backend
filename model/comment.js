const mongoose =require("mongoose")

const Schema = mongoose.Schema


const CommentSchemma = new Schema({
    auhtor:{type: Schema.Types.ObjectId, ref:"User"},
    post:{type:Schema.Types.ObjectId, ref:"Post"},
    comment:{type: String, required:true, maxLength:500}
})

module.exports = mongoose.model("Comment", CommentSchemma)