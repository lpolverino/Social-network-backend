const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2")
const User = require("./model/user")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { jwtDecode } = require('jwt-decode');
require("dotenv").config()
const utils = require("./utils")

const strategy = new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ user_name: username }).exec();
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
      } catch(err) {
        return done(err);
    };
})

const github = new GitHubStrategy({
  clientID: process.env.REACT_APP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  callbackURL: "http://localhost:"+process.env.PORT+"/auth/github/callback"
},
 async (accessToken, refreshToken, profile, done) => {
  try{
   const user = await User.findOne({github_id:profile.id}).exec() 
   if(user === null){
     const user ={
       user_name: profile.username,
       github_id: profile.id,
       email: 'undefined',
       github_image: profile.photos[0].value,
       notifications:{
        unread:false,
        notifications:[]
       },
       image:""
     }
     const dbuser = await bcrypt.hash(profile.login + profile.id,10)
      .then(hashedPassword => {
        user.password = hashedPassword
        return new User(user)
      })
      const savedUser = await dbuser.save()
      return done(null, savedUser)
    }
    return done(null, user)
  }
  catch (e){
    return done(e,false)
  }
}
);

const parseToken = (req,res,next) =>{
  const bearerHeader = req.headers['authorization']
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1]
    req.token = bearerToken;
    next()
  } else{
    res.status(403).json({error:utils.errorToJson("Invalid Authorizations Header")})
  }
}

const verifyToken = (req,res,next) => {
  jwt.verify(req.token, process.env.SECRET_P, (err, authData) => {
    if(err){
      return res.status(403).json({error:utils.errorToJson(`Validation Fail`, err)})
    }else{
     next() 
    }
  })
}

const isTokenForRouteUser = (req,res,next) => {
  const decodedToken = jwtDecode(req.token)
  if(req.params.userId !== decodedToken.user._id){
    return res.status(403).json({error: utils.errorToJson('You are not allowed to use this resource')}) 
  }
  next()
} 

const addUser = (req,res,next) => {
  const decodedToken = jwtDecode(req.token)
  req.userId = decodedToken.user._id
  next()
}

exports.parseToken = parseToken

exports.verifyToken = verifyToken

exports.local_strategy = strategy

exports.github_authentication = github

exports.isTokenForRouteUser = isTokenForRouteUser 

exports.addUser = addUser