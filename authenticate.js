const LocalStrategy = require("passport-local").Strategy;
const User = require("./model/user")
var bcrypt = require('bcryptjs');


const strategy = new LocalStrategy(async (username, password, done) => {
    console.log(`user:${username} password:${password}.`);
      try {
        const user = await User.findOne({ user_name: username }).exec();
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        console.log(user.password);
        const match = await bcrypt.compare(password, user.password);
        console.log("match result" + match);
        if (!match) {
          return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
      } catch(err) {
        return done(err);
    };
})

const parseToken = (req,res,next) =>{
  const bearerHeader = req.headers['authorization']
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1]
    req.token = bearerToken;
    next()
  } else{
    res.status(403).json({message:"Invalid Authorizations Header"})
  }
}

const verifyToken = (req,res,next) => {
  jwt.verify(req.token, process.env.SECRET_P, (err, authData) => {
    if(err){
      return res.status(403).json({message:`Validation Fail`, error:err})
    }else{
     next() 
    }
  })
}

exports.parseToken = parseToken

exports.verifyToken = verifyToken

exports.local_strategy = strategy