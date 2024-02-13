const User = require("../model/user")
const Post = require("../model/post")
const asyncHandler = require("express-async-handler")
const {body, validationResult} = require("express-validator")


exports.add_post = [
    body("author")
    .trim()
    .isLength({min:1,max:100})
    .withMessage("author should not be empty")
    .custom(async author =>{
        const user = await User.findById(author).select("user_name").exec()
        if(user === null){
            throw new Error("author is not register")
        }
    }),
    body("content")
    .trim()
    .isLength({min:1, max:1000})
    .withMessage("content should not be empty"),
    asyncHandler( async (req,res,next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const newPost = new Post({
            author:req.body.author,
            content:req.body.author,
        })

        const savedPost = await newPost.save()
        if( savedPost ){
            return res.status(200).json({postId:savedPost._id});   
        }
        return res.status(500).json({errors:{msg:"The Server cant process your request"}})
    })
]