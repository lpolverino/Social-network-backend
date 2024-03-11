const User = require("../model/user")
const Post = require("../model/post")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const utils = require("../utils")


exports.add_following = [
    body("username")
    .trim()
    .isLength({min:1})
    .withMessage("Username should not be empty"),
    asyncHandler( async (req,res,next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: utils.parseErrorsToJson(result.array()) });
        }

        const userToFollow = await User.findOne({user_name:req.body.username}).exec()
        if (userToFollow === null) {
            return res.status(400).json(utils.errorToJson("User not found"))
        }

        console.log(userToFollow);

        const user = await User.findById(req.params.userId).exec()
        if(user === null){
            return res.status(404).json(utils.errorToJson("Invalid User"))
        }

        const alreadyFollowing = user.following.filter(el => el._id.toString() === userToFollow._id.toString())

        if(alreadyFollowing.length > 0) return res.status(400).json(utils.errorToJson("Already Fallowing"))

        const userWithNewFollowing = {
            _id: user._id,
            user_name:user.user_name,
            password:user.password,
            email:user.email,
            about:user.about,
            image:user.image,
            birth_date:user.birt_date,
            sing_date:user.sing_date,
            followers:user.followers,
            following: user.following.concat([{
                _id:userToFollow._id,
                username:userToFollow.user_name,
            }]),
            github_id:user.github_id,
            github_image:user.github_image,
        }

        const notification = {
            type:"Follow",
            content: `the User ${user.user_name} started to follow You`,
            url:user._id
        }

        const userWithNewFallower = {
            _id:userToFollow._id,
            user_name:userToFollow.user_name,
            password:userToFollow.password,
            email:userToFollow.email,
            about:userToFollow.about,
            image:userToFollow.image,
            birth_date:userToFollow.birt_date,
            sing_date:userToFollow.sing_date,
            followers: userToFollow.followers.concat([{
                _id:user._id,
                username:user.user_name,
            }]),
            following:userToFollow.following,
            github_id:userToFollow.github_id,
            github_image: userToFollow.github_image,
            notifications:{
                unread:true,
                notifications:userToFollow.notifications.notifications.concat([notification])
            }
        }

        const [updatedFollowerUser,updatedFollowedUser] = await Promise.all([
            User.findByIdAndUpdate(req.params.userId, userWithNewFollowing, {}),
            User.findByIdAndUpdate(userToFollow._id,userWithNewFallower, {})
        ])
       
        if(updatedFollowerUser === null || updatedFollowedUser === null) {
            return res.status(500).json(utils.errorToJson("internal error"))
        }
        return res.status(200).json({msg:"following completed", followedUser:{_id:userToFollow._id, username:userToFollow.user_name}, notification})
    })
]

exports.user_profile = asyncHandler( async (req,res,next) => {
    const user = await User.findById(req.params.userId).select("-password").exec()
    if(user === null){
        return res.status(404).json(utils.errorToJson("The solicited user Porfile dosent Exists"))
    }

    const userPost = await Post.find({author:user._id}).populate("author","user_name").exec()

    if (userPost=== null | userPost === undefined) {
        return res.status(500).json(utils.errorToJson("There was an error fetching the posts of the user " + user._id))
    }

    return res.status(200).json({user:user, posts:userPost})
})

exports.read_notifications = asyncHandler( async (req,res,next) => {
    const user = await User.findById(req.params.userId).exec();
    
    if(user === null) {
        return res.status(404).json(utils.errorToJson("User not found"))
    }

    const userWithOutNotifications = {
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
        github_image: user.github_image,
        notifications:{
            unread:false,
            notifications:user.notifications.notifications
        }
    }    

    const savedUser = await User.findByIdAndUpdate(req.params.userId, userWithOutNotifications, {})
    if (savedUser === null || savedUser === undefined) 
        return res.status(500).json(utils.errorToJson("Error Clearing the Notifications"))
    return res.status(200).json({msg:"User Read the Notificatiosn"})
})

exports.index_posts = asyncHandler ( async (req,res,next) => {
    const user = await User.findById(req.userId).select("-password").exec()

    if(user === null) return res.status(404).json(utils.errorToJson("Invalid user"))

    const folloUsersId = user.following.map(user => user._id).concat([req.userId])

    const posts = await Post.find({author:{$in:folloUsersId}}).limit(50).sort({date:-1}).populate("author", "user_name").exec()

    return res.status(200).json({posts})
})

exports.edit_profile = [
    body("about")
    .trim()
    .isLength({max:500})
    .withMessage("About section to large"),
    asyncHandler(async (req,res,next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: utils.parseErrorsToJson(result.array()) });
        }

        const user = await User.findById(req.params.userId).exec()

        if(user === null){
            return res.status(404).json({error: utils.errorToJson("user not found")})
        }
         const userWithNewValues = {
            _id:user._id,
            user_name:user.user_name,
            password:user.password,
            email:user.email,
            about:req.body.about === '' ? user.about: req.body.about,
            image:req.body.image === '' ? user.image: req.body.image,
            birth_date:user.birt_date,
            sing_date:user.sing_date,
            followers: user.followers,
            following:user.following,
            github_id:user.github_id,
            github_image: user.github_image,
            notifications:user.notifications
        }

        console.log(req.body);
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, userWithNewValues, {}).exec()

        if(updatedUser) return res.status(200).json({msg:'User updated correctly'});
        
        return res.status(500).json({error: utils.errorToJson('User was not updateded')});

    })
]

exports.get_user_posts = asyncHandler( async (req,res,next) => {

})