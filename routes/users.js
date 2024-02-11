const express = require('express');
const router = express.Router();
const authentication = require("../authenticate")
const userControler = require("../controlers/userControler")


/* GET users listing. */
router.get("/:userId/profile",authentication.parseToken, authentication.verifyToken, userControler.user_profile)

router.post("/:userId/follow", authentication.parseToken, authentication.verifyToken, userControler.add_following)


module.exports = router;
