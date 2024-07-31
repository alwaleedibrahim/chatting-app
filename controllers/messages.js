const MessageModel = require("./../models/messages");
const UsersModel = require("./../models/users");

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

    await UsersModel.findByIdAndUpdate(sender._id, {
      $addToSet: { contacts: recipient._id  },
    });
    await UsersModel.findByIdAndUpdate(recipient._id, {
      $addToSet: { contacts: sender._id },
    });
  } catch (e) {
    console.log(e.message);
  }
};
