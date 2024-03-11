const express = require('express');
const router = express.Router();
const authentication = require("../authenticate")
const userControler = require("../controlers/userControler")


/* GET users listing. */
router.get("/:userId/profile",authentication.parseToken, authentication.verifyToken, userControler.user_profile)

router.post("/:userId/follow", authentication.parseToken, authentication.verifyToken, authentication.isTokenForRouteUser, 
 userControler.add_following
);

router.put("/:userId/profile", authentication.parseToken, authentication.verifyToken, authentication.isTokenForRouteUser,
  userControler.edit_profile)

router.put("/:userId/notifications", authentication.parseToken, authentication.verifyToken, authentication.isTokenForRouteUser,
userControler.read_notifications);

router.get("/index", authentication.parseToken, authentication.verifyToken, authentication.addUser,
userControler.index_posts)

router.get("/:userId/posts", authentication.parseToken, authentication.verifyToken,
userControler.get_user_posts
)

module.exports = router;
