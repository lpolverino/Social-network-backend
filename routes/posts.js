const express = require('express')
const router = express.Router();
const authentication = require("../authenticate")
const postControler = require("../controlers/postControler")


router.post("/", authentication.parseToken, authentication.verifyToken,
    postControler.add_post
);


module.exports = router;