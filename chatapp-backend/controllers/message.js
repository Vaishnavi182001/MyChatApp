const Conversation = require('../models/conversationModels');
const User = require('../models/userModels');
const Message = require('../models/messageModels');
const helpers = require('../Helpers/helpers');

module.exports = {


  async GetAllMessages(req, res) {
  const { sender_id, receiver_id } = req.params;
  try {
    const conversation = await Conversation.findOne({
      $or: [
        {
          $and: [
            { 'participants.senderId': sender_id },
            { 'participants.receiverId': receiver_id }
          ]
        },
        {
          $and: [
            { 'participants.senderId': receiver_id },
            { 'participants.receiverId': sender_id }
          ]
        }
      ]
    }).select('_id');

    if (conversation) {
      const messages = await Message.find({
        conversationId: conversation._id
      });

      if (messages) {
        res.status(200).send({ message: 'Messages returned', data: messages });
      } else {
        res.status(404).send({ message: 'No messages found' });
      }
    } else {
      res.status(404).send({ message: 'Conversation not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
},


  async SendMessage(req, res) {
    const { sender_id, receiver_id } = req.params;

    try {
      const result = await Conversation.find({
        $or: [
          {
            participants: {
              $elemMatch: { senderId: sender_id, receiverId: receiver_id }
            }
          },
          {
            participants: {
              $elemMatch: { senderId: receiver_id, receiverId: sender_id }
            }
          }
        ]
      });

      if (result.length > 0) {
        // Handle the case where a conversation already exists

        const msg = await Message.findOne({conversationId: result[0]._id});
        helpers.updateCheckList(req,msg);
        await Message.updateOne(
          {
            _id: result[0]._id
          },
          {
            $push: {
              message: {
                senderId: req.user._id,
                receiverId: req.params.receiver_id,
                senderName: req.user.username,
                receiverName: req.body.receiverName,
                body:req.body.message,
              }
            }
          }
        );
        res.status(200).send({
          message: 'Message added successfully'
        });
      } else{
        const newConversation = new Conversation();
        newConversation.participants.push({
          senderId: req.user._id,
          receiverId: req.params.receiver_id
        });
        const saveConversation = await newConversation.save();
        const newMessage = new Message();
        newMessage.conversationId = saveConversation._id;
        newMessage.sender= req.user.username;
        newMessage.receiver = req.body.receiverName;
        newMessage.message.push({
          senderId: req.user._id,
          receiverId: req.params.receiver_id,
          senderName: req.user.username,
          receiverName: req.body.receiverName,
          body:req.body.message,
        })

        await User.updateOne(
          {
            _id: req.user._id
          },
          {
            $push:{
              chatList:{
                $each:[
                  {
                    receiverId: req.params.receiver_id,
                    msgId: newMessage._id
                  }
                ],
                $position:0
              }
            }
          }
        );

        await User.updateOne(
          {
            _id: req.params.receiver_id
          },
          {
            $push:{
              chatList:{
                $each:[
                  {
                    receiverId: req.user._id,
                    msgId: newMessage._id
                  }
                ],
                $position:0
              }
            }
          }
        );

        await newMessage.save()
        res.status(200).send({
          message: 'Message sent successfully' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  },


  async MarkReceiverMessages(req, res) {
    const { sender, receiver } = req.params;
    const msg = await Message.aggregate([
      {
        $unwind: '$message'
      },
    {
      $match: {
        $and: [{
          'message.sendername':receiver,
          'message.receivername':sender,
        }]
      }
    }])
    if(msg.length > 0){
   try{

    msg.forEach(async (value) => {
      await Message.updateOne(
        { 'message._id': value.message._id },
        { $set: { 'message.$.isRead': true } }
      );
    });
    res.status(200).json({message:"Messages are marked as read"});

   }catch (err){

    res.status(500).send({ error: 'Internal Server Error' });

   }
     }
    },





    async MarkReceiverAllMessages(req, res) {
      try {
        // Find all messages where the receiver is the current user
        const messages = await Message.find({ 'message.receivername': req.user.username });
        if (messages.length === 0) {
          return res.status(200).json({ message: 'No messages to delete' });
        }
        // Remove all message subdocuments where receivername matches
        for (const msgDoc of messages) {
          msgDoc.message = msgDoc.message.filter(m => m.receivername !== req.user.username);
          await msgDoc.save();
        }
        res.status(200).json({ message: 'All messages for this user have been deleted' });
      } catch (err) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
};
