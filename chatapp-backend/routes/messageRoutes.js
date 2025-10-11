const express = require('express');
const router = express.Router();
const MessageCtrl = require('../controllers/message');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/chat-message/:sender_id/:receiver_id', AuthHelper.VerifyToken, MessageCtrl.GetAllMessages);
router.get('/receiver-messages/:sender/:receiver', AuthHelper.VerifyToken, MessageCtrl.MarkReceiverMessages);
router.post('/chat-message/:sender_id/:receiver_id', AuthHelper.VerifyToken, MessageCtrl.SendMessage);
router.get('/mark-all-message', AuthHelper.VerifyToken, MessageCtrl.MarkReceiverAllMessages);

module.exports = router;