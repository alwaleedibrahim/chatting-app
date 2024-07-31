const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  contacts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
  ],
});

UsersSchema.pre("save", function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, async (err, hash) => {
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("Users", UsersSchema);
