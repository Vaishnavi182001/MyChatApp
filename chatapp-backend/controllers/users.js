const User = require('../models/userModels');
const moment = require('moment');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

module.exports = {

    async GetAllUsers(req, res) {
        try {
            const users = await User.find({})
                                    .populate('posts.postId') // Fetch all users from the database
                                    .populate('following.userFollowed')
                                    .populate('followers.follower')
                                    .populate('chatList.receiverId')
                                    .populate('chatList.msgId');
            res.status(200).json({ message: 'All Users', result: users });
        } catch (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ message: 'Error in fetching users', error: err });
        }
    },

    async GetNotifications(req, res) {
        try {
            const notifications = await User.findById({ _id: req.user._id }, {
                notifications: 1, //projection to include only notifications
                _id: 0
            }).sort({ 'notifications.created': -1 }); // Fetch notifications for the logged-in user

            res.status(200).json({ message: 'Notifications', result: notifications });
        } catch (err) {
            console.error('Error fetching notifications:', err);
            res.status(500).json({ message: 'Error in fetching notifications', error: err });
        }
    },

    async GetUser(req, res) {
        try {
            const userId = await User.findById({ _id: req.params.id })
                                      .populate('posts.postId')
                                      .populate('following.userFollowed')
                                      .populate('followers.follower')
                                      .populate('chatList.receiverId')
                                      .populate('chatList.msgId');
            res.status(200).json({ message: 'User By Id', result: userId });
        } catch (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ message: 'Error in fetching user', error: err });
        }
    },

    async GetUserByName(req, res) {
        try {
            const userId = await User.findOne({ username: req.params.username })
                                      .populate('posts.postId')
                                      .populate('following.userFollowed')
                                      .populate('followers.follower')
                                      .populate('chatList.receiverId')
                                    .populate('chatList.msgId');
            res.status(200).json({ message: 'User By username', result: userId });
        } catch (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ message: 'Error in fetching user', error: err });
        }
    },

    async ProfileView(req, res) {
        const dataValue = moment().format('YYYY-MM-DD');
        await User.updateOne({
            _id: req.body.userId,
            'notifications.date': { $ne: dataValue }, // Check if the date is not equal to today's date
            'notifications.senderId': req.user._id // Check if the senderId is not the same as the current user
        },

        {
            $push:{
                notifications:{
                    senderId: req.user._id,
                    message: `${req.user.username} viewed your profile`,
                    viewProfile: true,
                    date: dataValue ,// Set the date to today's date
                    created: new Date()
            }
        }
    }
    ).then((result) => {

        res.status(200).json({ message: 'Profile view notification sent' });

    }).catch((err) => {
        console.error('Error in profile view notification:', err);
        res.status(500).json({ message: 'Error in profile view notification', error: err });
    });
},

 async ChangePassword(req,res){
    const schema = Joi.object().keys({
        cpassword: Joi.string().required(),
        newPassword: Joi.string().min(5).required(),
        confirmPassword: Joi.string().min(5).optional()

    });

    const {error,value} = schema.validate(req.body);
    if(error && error.details){
        return res.status(400).json({ message: 'Validation error', details: error.details });
    }
    const user = await User.findById({_id: req.user._id});

    return bcrypt.compare(value.cpassword, user.password).then(async (isMatch) => {
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        const newpassword = await User.EncryptPassword(value.newPassword);
        await User.updateOne(
            {
                _id: req.user._id
            },
            {
               password: newpassword
             }
            )
            .then((result) => {
        res.status(200).json({ message: 'Password changed successfully' });
         })
    .catch((err) => {
        console.error('Error changing password:', err);
        res.status(500).json({ message: 'Error changing password', error: err });
    });
  })

}



}