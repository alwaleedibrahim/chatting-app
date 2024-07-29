const jwt = require("jsonwebtoken");
const util = require("util");

exports.auth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const decoded = await util.promisify(jwt.verify)(
      authorization,
      process.env.TOKEN_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "unauthorized" });
  }
};

exports.socketAuth = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) {
    return next(new Error("no token"));
  }

  jwt.verify(header, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("invalid token"));
    }

    req.user = decoded;
    next();
  });
};
