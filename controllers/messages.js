const MessageModel = require("./../models/messages");

exports.newMessage = async (message) => {
  try {
    await MessageModel.create(message);
  } catch (e) {}
};
