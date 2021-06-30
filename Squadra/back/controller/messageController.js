const Message = require("../models").Message;

const messageController = {
  addMessage: async (req, res) => {
    const message = {
      title: req.body.title,
      type: req.body.type,
      content: req.body.content,
      date: req.body.date,
      isSolved: req.body.isSolved,
      ownerId: req.body.ownerId,
    };
    try {
      const createdMessage = await Message.create(message);
      res.status(201).send({
        msg: "Added message with succees",
      });
    } catch (err) {
      res.status(400).send({
        msg: "Message not added",
      });
    }
  },

  getMessage: async (req, res) => {
    try {
      const message = await Message.findByPk(req.params.id);
      res.status(200).send({
        message,
      });
    } catch (err) {
      res.status(404).send({
        msg: "Message not found",
      });
    }
  },

  getAllMessages: async (req, res) => {
    try {
      const messages = await Message.findAll();
      res.status(200).send({
        messages,
      });
    } catch (err) {
      res.status(404).send({
        msg: "Messages not found",
      });
    }
  },

  updateMsg: async (req, res) => {
    const msgToBeSent = {
      title: req.body.title,
      type: req.body.type,
      content: req.body.content,
      date: req.body.date,
      isSolved: req.body.isSolved,
      ownerId: req.body.ownerId,
    };
    try {
      msgDB = await Message.update(msgToBeSent, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send({
        msg: "Message updated",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        msg: "Something went wrong while trying to update a message",
      });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const message = await Message.findByPk(req.params.id);
      if (message) {
        await message.destroy();
        res.status(200).send({
          msg: "Message deleted",
        });
      } else {
        res.status(404).send({
          msg: "Message not found",
        });
      }
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong while trying to delete a message",
      });
    }
  },
};

module.exports = messageController;
