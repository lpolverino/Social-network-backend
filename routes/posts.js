const express = require('express')
const router = express.Router();
const authentication = require("../authenticate")
const postControler = require("../controlers/postControler")


router.post("/:userId", authentication.parseToken, authentication.verifyToken, authentication.verifyUser,
    postControler.add_post
);

router.post("/:postId/likes/:userId", authentication.parseToken,authentication.verifyToken, authentication.verifyUser,
    postControler.add_like
)

module.exports = router;