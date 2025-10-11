const express = require('express');
const router = express.Router();
const PostCtrl = require('../controllers/posts');
const AuthHelper = require('../Helpers/AuthHelper');
//const authMiddleware = require('../middleware/authMiddleware');

router.get('/posts', AuthHelper.VerifyToken, PostCtrl.GetAllPosts);
router.get('/posts/:id', AuthHelper.VerifyToken, PostCtrl.GetPost);
router.post('/add-post', AuthHelper.VerifyToken, PostCtrl.AddPost);
router.post('/add-like', AuthHelper.VerifyToken, PostCtrl.AddLike);
router.post('/add-comment', AuthHelper.VerifyToken, PostCtrl.AddComment);

module.exports = router;