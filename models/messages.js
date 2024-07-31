const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", MessagesSchema);
