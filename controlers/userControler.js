const User = require("../model/user")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
var bcrypt = require('bcryptjs');


exports.add_following = [
    body("username")
    .trim()
    .isLength({min:1})
    .withMessage("Username should not be empty"),
    asyncHandler( async (req,res,next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const userToFollow = await User.findOne({user_name:req.body.username}).exec()
        if (userToFollow === null) {
            return res.status(400).json({errors:{msg:"User not found"}})
        }

        const user = await User.findById(req.params.userId).exec()
        if(user === null){
            return res.status(404).json({errors:{msg:"Invalid User"}})
        }

        const alreadyFollowing = user.following.filter(el => el._id === userToFollow._id)

        if(alreadyFollowing) return res.status(400).json({errors:{msg:"Already Fallowing"}})

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
            github_id:user.github_id
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
        }

        const [updatedFollowerUser,updatedFollowedUser] = await Promise.all([
            User.findByIdAndUpdate(req.params.userId, userWithNewFollowing, {}),
            User.findByIdAndUpdate(userToFollow._id,userWithNewFallower, {})
        ])
        
        if(updatedFollowerUser === null || updatedFollowedUser === null) {
            return res.status(500).json({errors:{msg:"internal error"}})
        }
        return res.status(200).json({msg:"following completed", followedUser:{_id:userToFollow._id, username:userToFollow.user_name}})
    })
]

exports.user_profile = asyncHandler( async (req,res,next) => {
    const user = await User.findById(req.params.userId).select("-password").exec()
    if(user === null){
        return res.status(404).json({error:{msg:"The solicited user Porfile dosent Exists"}})
    }
    return res.status(200).json({user:user})
})