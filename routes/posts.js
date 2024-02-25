const express = require('express')
const router = express.Router();
const authentication = require("../authenticate")
const postControler = require("../controlers/postControler")

router.get("/:postId", authentication.parseToken, authentication.verifyToken, 
    postControler.get_post
)

router.post("/:userId", authentication.parseToken, authentication.verifyToken, authentication.isTokenForRouteUser,
    postControler.add_post
);

router.post("/:postId/likes/:userId", authentication.parseToken,authentication.verifyToken, authentication.isTokenForRouteUser,
    postControler.add_like
)

router.post("/:postId/comments/:userId",authentication.parseToken,authentication.verifyToken, authentication.isTokenForRouteUser,
postControler.add_comment)

router. get("/:postId/comments",authentication.parseToken,authentication.verifyToken,
    postControler.get_comments)

module.exports = router;