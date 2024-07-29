const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UsersModel = require("../models/users");

exports.create = async (req, res) => {
  console.log(req.body)
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ status: "failed", message: err.message });
  }

  try {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        req.body.password = hash;
        await UsersModel.create(req.body);
        res.status(201).json({ status: "success" });
      });
    });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: "failed", message: err.message });
  }
  try {
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "not found", message: "user not found" });
    }
    let isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(400)
        .json({ status: "failed", message: "invalid password" });
    }
    const token = generateToken(
      { email: user.email, id: user._id },
      process.env.TOKEN_SECRET,
      "1h"
    );
    const refreshToken = generateToken(
      { email: user.email, id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      "7d"
    );
    res.status(200).json({ token, refreshToken , user: { email: user.email, id: user._id }});
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.findOne = async (query) => {
  try {
    const user = await UsersModel.findOne(query);
    return user;
  } catch (e) {
    return null;
  }
};

const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};
