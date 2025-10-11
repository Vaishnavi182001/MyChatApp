
const Joi =  require('joi')
const User = require('../models/userModels');
const moment = require('moment');

const Post = require('../models/postModels');
module.exports = {
    AddPost(req, res) {

     const schema = Joi.object().keys({
        post: Joi.string().required()
     });

     const { error } = schema.validate(req.body);

     if(error && error.details){
        return res.status(400).json({msg: error.details[0].message});
     }

     const body ={
        user: req.user._id,
        username: req.user.username,
        post: req.body.post,
        created: new Date()
     }

     Post.create(body).then( async post =>{
      //whenever new post created we will get document of user and push the post id to the user document
      //this is done to get all the posts of the user in one place

      await User.findByIdAndUpdate(
         {
            _id: req.user._id
         },
         {
            $push: {
               posts: {
                 $each: [{
                   postId: post._id,
                   post: req.body.post,
                   created: new Date()
                 }],
                 $position: 0
               }
            }
         }
      )
        res.status(201).json({message: 'Post created successfully', post});
     })
     .catch(err =>{
        console.error('Error creating post:', err);
        res.status(500).json({message: 'Error creating post'});
     });

    },

    async GetAllPosts(req, res) {
      try{

         const posts = await Post.find({})
         .populate('user')
         .sort({created: -1})

         const top = await Post.find({totalLikes:{$gte:1}})
         .populate('user')
         .sort({created: -1})

         return res.status(200).json({message:'All Post',posts,top})

      }catch(err){
         return res.status(500).json({message: 'Error getting posts'});
      }
    },

   async AddLike(req, res) {
      const postId = req.body._id;

      try {
         // Check if the user has already liked the post
         const post = await Post.findOne({
            _id: postId,
            "likesCount.username": req.user.username // Check if the username already exists in the likes array
         });

         if (post) {
            return res.status(400).json({ message: 'You have already liked this post' });
         }

         // If not liked, proceed to add the like
         const updatedPost = await Post.findByIdAndUpdate(
            { _id: postId },
            {
               $push: { likesCount: { username: req.user.username } }, // Push an object with the username
               $inc: { totalLikes: 1 } // Increment the totalLikes count
            },
            { new: true } // Return the updated document
         );

         if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
         }

         return res.status(200).json({
            message: 'Post liked successfully',
            likesCount: updatedPost.totalLikes // Return the updated totalLikes count
         });
      } catch (err) {
         console.error('Error liking post:', err);
         return res.status(500).json({ message: 'Error liking post' });
      }
   },

   async AddComment(req, res) {
      console.log('Adding comment to post with ID:', req.body.postId);
      console.log('Comment:', req.body);

      const postId = req.body.postId;
       await Post.findByIdAndUpdate(
         {
            _id: postId
         },
         {
            $push:{
               comments:{
                  userId: req.user._id,
                  username: req.user.username,
                  comment: req.body.comment,
                  createdAt: new Date()
               }
            }
         }
       )
       .then(()=>{
         res.status(200).json({message: 'Comment added to post successfully'})
       })
       .catch(err =>{
         console.error('Error adding comment:', err);
         res.status(500).json({message: 'Error adding comment'});
       })
   },

   async GetPost(req, res) {
      console.log('Getting post with ID:', req.params.id);
      await Post.findOne({ _id: req.params.id })
        .populate('user')
        .populate('comments.userId')
        .then((post) => {
          if (!post) {
            return res.status(404).json({ message: 'Post not found' });
          }
          res.status(200).json({ message: 'Post found', post });
        })
        .catch((err) => {
          console.error('Error getting post:', err);
          res.status(500).json({ message: 'Error getting post' });
        });
    }
}