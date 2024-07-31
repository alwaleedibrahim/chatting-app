const MessageModel = require("./../models/messages");
const UsersModel = require("./../models/users");

exports.newMessage = async (message) => {
  try {
    const sender = await UsersModel.findOne({ email: message.sender });
    const recipient = await UsersModel.findOne({ email: message.recipient });
    if (!sender || !recipient) {
      throw new Error("invalid message data");
    }
    message.sender = sender._id;
    message.recipient = recipient._id;
    await MessageModel.create(message);

    await UsersModel.findByIdAndUpdate(sender._id, {
      $push: { contacts: { user_id: recipient._id } },
    });
    await UsersModel.findByIdAndUpdate(recipient._id, {
      $push: { contacts: { user_id: sender._id } },
    });
  } catch (e) {
    console.log(e.message);
  }
};
