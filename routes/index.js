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
    console.log(info);
    if (err || !user) {
        return res.status(400).json({
            message: info.message,
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

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ],session:false })
);

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to front end app (refactor needed).
    console.log("success github");
    const token = jwt.sign({user:req.user}, process.env.SECRET_P)
    console.log(`user: ${req.user._id} token:${token}`);
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
