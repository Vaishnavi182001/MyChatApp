const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/users');
const AuthHelper = require('../Helpers/AuthHelper');
console.log(UserCtrl)

router.get('/users', AuthHelper.VerifyToken, UserCtrl.GetAllUsers);
router.get('/users/:id', AuthHelper.VerifyToken, UserCtrl.GetUser);
router.get('/username/:username', AuthHelper.VerifyToken, UserCtrl.GetUserByName);
router.get('/notifications', AuthHelper.VerifyToken, UserCtrl.GetNotifications);
router.post('/view-profile', AuthHelper.VerifyToken, UserCtrl.ProfileView);
router.post('/change-password', AuthHelper.VerifyToken, UserCtrl.ChangePassword);

module.exports = router;