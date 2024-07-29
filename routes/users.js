const express = require("express")

const router = express.Router()

const {create, login} = require("../controllers/user")

router.post("/login", login)
router.post("/signup", create)

module.exports = router