const express = require('express');
const router = express.Router();
const authentication = require("../authenticate")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator")
const User = require("../model/user")
const bcrypt = require('bcryptjs');
const utils = require("../utils")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/private', authentication.parseToken,authentication.verifyToken, (req,res,next) =>{
  res.json({message:"private"})
})
router.post('/login',(req,res,next) =>{
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
        return res.status(400).json(utils.errorToJson(info.message,err));
    } 
    const token = jwt.sign({user}, process.env.SECRET_P);
    return res.json({token,user:user._id});
   
  })(req, res);
})

router.post('/singup',
  body("username")
  .trim()
  .isLength({min:1, max:100})
  .withMessage("incorrect Length"),
  body("password")
  .trim()
  .isLength({min:5})
  .withMessage("password too short"),
  body("email")
  .trim()
  .isLength({min:1})
  .withMessage("email should not be empty")
  .isEmail()
  .withMessage("email bad formated"),
  asyncHandler(async (req,res,next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: utils.parseErrorsToJson(result.array() )});
    }

    const user = await User.findOne({user_name:req.body.username}).select("user_name").exec()

    if(user !== null){
      return res.status(400).json( utils.errorToJson("username already taken"))      
    }
    const imageUrl = utils.getGravatarHash(req.body.email)

    const newUser = await bcrypt.hash(req.body.password, 10)
      .then(hashedPassword => {
        return new User({
          user_name:req.body.username,
          password: hashedPassword,
          email:req.body.email,
          image: imageUrl,
          notifications:{
            unread:false,
            notifications:[]
          },
        })
      })
      .catch( e =>{
        return res.status(500).json( utils.errorToJson("cannot save user"))
      })
    const savedUser = await newUser.save()
    const token = jwt.sign({user:newUser}, process.env.SECRET_P);
    return res.json({token,user:savedUser._id});
  })
);

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ],session:false })
);

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to front end app (refactor needed).
    const token = jwt.sign({user:req.user}, process.env.SECRET_P)
    res.status(200).send(
      `<!DOCTYPE html>
        <html lang="en">
          <body>
          </body>
          <script>
          window.opener.postMessage(${JSON.stringify({token,user:req.user._id})}, 'http://localhost:5173/login')
          </script>
        </html>`);
  });

module.exports = router;
