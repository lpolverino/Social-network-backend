const User = require("../model/user")
const Post = require("../model/post")
const Comment = require("../model/comment")
const asyncHandler = require("express-async-handler")
const {body, validationResult} = require("express-validator")

const addNotification = async (userToAddNotification, userWhoCreatedNotificaion ,postId, content) => {
    const user = await User.findById(userToAddNotification).exec()
    if(user === null || user === undefined) return undefined

    const newNotification = {
        type:"Post",
        content: content,
        url:postId,
    }

    const userWithNewNotification = {
        _id:user._id,
        user_name:user.user_name,
        password:user.password,
        email:user.email,
        about:user.about,
        image:user.image,
        birth_date:user.birt_date,
        sing_date:user.sing_date,
        followers:user.followers,
        following:user.following,
        github_id:user.github_id,
        github_image:user.github_image,
        notifications:{
            unread:true,
            notifications:user.notifications.notifications.concat([newNotification])
        }
    }
    const savedUser = await User.findByIdAndUpdate(userToAddNotification, userWithNewNotification, {})
    if(savedUser === null || savedUser === undefined )
        return undefined
    
    return savedUser
}

exports.add_post = [
    body("content")
    .trim()
    .isLength({min:1, max:1000})
    .withMessage("content should not be empty"),
    asyncHandler( async (req,res,next) => {
        const errors = validationResult(req)
        
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const user = await User.findById(req.params.userId).select("user_name").exec()
        if(user === null){
            throw new Error("author is not register")
        }

        const newPost = new Post({
            author:user._id,
            content:req.body.content,
            likes:{
                total:0,
                likes:[]
            }
        })

        const savedPost = await newPost.save()
        if( savedPost ){
            return res.status(200).json({post:savedPost, post_author:user.user_name});   
        }
        return res.status(500).json({errors:{msg:"The Server cant process your request"}})
    })
]

exports.add_like = asyncHandler( async (req,res,next) => {
    const [user,post] = await Promise.all([
        User.findById(req.params.userId),
        Post.findById(req.params.postId)
    ])
    if(user === null || post === null){
        return res.status(404).json({error:{msg:"the user or post dosent exists"}})
    }

    const userLikedThePost = post.likes.likes.filter(userWhoLikedPost => userWhoLikedPost.toString() === req.params.userId)
    console.log(userLikedThePost);
    console.log(user._id)
    const newLikes = (userLikedThePost.length > 0)
        ?{
            total: post.likes.total - 1,
            likes: post.likes.likes.filter(userWhoLikedPost => !userWhoLikedPost.equals(user._id))
        }
        :{
            total: post.likes.total + 1,
            likes: post.likes.likes.concat([user._id])
        }    

    const updatedPost = {
        _id: post._id,
        author:post.author,
        content:post.content,
        date: post.date,
        comments:post.comments,
        likes:newLikes,
    }

    const savedUser = await addNotification(post.author, req.params.userId,req.params.postId, `The User ${req.params.userId} liked your Post`)
    
    if(savedUser === undefined) return res.status(500).json({msg:"Error Liking The post"})
    const savedUpdatedPost = await Post.findByIdAndUpdate(req.params.postId,updatedPost,{})

    if(savedUpdatedPost === undefined) return res.status(500).json({msg:"Error Liking The post"})

    return res.status(200).json({msg:"updated correctly", postId:savedUpdatedPost._id, newLikes})
})

exports.add_comment = [
    body("comment")
    .trim()
    .isLength()
    .withMessage("Comment should not be empty"),
    asyncHandler( async (req,res,next) => {
        const errors = validationResult(req.body)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const [user, post] = await Promise.all([
            User.findById(req.params.userId),
            Post.findById(req.params.postId),   
        ]) 
        if(user === null || post === null){
            return res.status(404).json({errors:{msg:"User or Post Dont founded"}})
        }
        const comment = new Comment({
            author:user._id,
            post:post._id,
            comment:req.body.comment,
        })

        const savedComment = await comment.save()
        
        const updatedPost = {
            _id: post._id,
            author:post.author,
            date:post.date,
            content:post.content,
            likes:post.likes,
            comments: post.comments.concat([savedComment._id])
        }
        const savedUser = await addNotification(post.author,req.params.userId, req.params.postId, `The User ${req.params.userId} Commented in your Post`)
        if(savedUser === undefined) return res.status(500).json({msg:"Error Liking The post"})

        const savedUpdatedPost = await Post.findByIdAndUpdate(req.params.postId, updatedPost, {})
        if(savedUpdatedPost === undefined) return res.status(500).json({msg:"Error Liking The post"})
        
        return res.status(200).json({
            msg:"comment posted correctly",
            comment:savedComment
        })
    })
]

exports.get_comments = asyncHandler( async (req,res,next) => {
    const comments = await Comment.find({post:req.params.postId}).populate("author","user_name").select("-post").exec()
    if(comments == null || comments === undefined) return res.status(500).json({error:{msg:"Cannot get the comments"}})
    console.log(comments);
    return res.status(200).json({comments})
})