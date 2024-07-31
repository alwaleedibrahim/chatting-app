const express = require("express");

const router = express.Router();

const { create, login, getContacts } = require("../controllers/user");
const { auth } = require("./../middlewares/auth");

router.post("/login", login);
router.post("/signup", create);

router.get("/contacts", auth, getContacts);

module.exports = router;
