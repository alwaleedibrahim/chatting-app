const MessageModel = require("./../models/messages");
const UsersModel = require("./../models/users");
const {addToContacts} = require("./user")

exports.newMessage = async (message) => {
  try {
    const sender = await UsersModel.findOne({ username: message.sender });
    const recipient = await UsersModel.findOne({ username: message.recipient });
    if (!sender || !recipient) {
      throw new Error("invalid message data");
    }
    message.sender = sender._id;
    message.recipient = recipient._id;
    await MessageModel.create(message);
    addToContacts(sender, recipient)
  } catch (e) {
    console.log(e.message);
  }
};
