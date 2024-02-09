const express = require('express');
const router = express.Router();
const authentication = require("../authenticate")
const passport = require("passport")
const jwt = require("jsonwebtoken")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/private', authentication.parseToken,authentication.verifyToken, (req,res,next) =>{
  res.json({message:"private"})
})
router.post('/login',(req,res,next) =>{
  passport.authenticate('local', (err, user, info) => {
    console.log(`if error ${err}`);
    console.log(`user:${user}`);
    if (err || !user) {
        return res.status(400).json({
            message: 'Something is not right',
            error:err,
        });
    } 
    const token = jwt.sign({user}, process.env.SECRET_P);
    return res.json({token,user:user._id});
   
  })(req, res);
})

router.post('/singup',(req,res,next) =>{
  res.json({message:"singup"})
})

module.exports = router;
