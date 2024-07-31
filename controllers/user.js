const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UsersModel = require("../models/users");

exports.create = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ status: "failed", message: "invalid data" });
  }

  try {
    await UsersModel.create(req.body);
    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ status: "failed", message: "invalid login" });
  }
  try {
    const user = await UsersModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "user not found" });
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
    res
      .status(200)
      .json({ token, refreshToken, user: { email: user.email, id: user._id } });
  } catch (err) {
    return res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.id);
    res.json({message:"success", data: user.contacts});
  } catch (err) {
    res.status(500).json({message:"Something went wrong"})
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
