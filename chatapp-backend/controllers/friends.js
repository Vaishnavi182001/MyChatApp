const User = require("../models/userModels");

const FollowUser = async (req, res) => {
  try {
    // Update the logged-in user's following list
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          following: { userFollowed: req.body.userFollowed },
        },
      },
      { new: true, upsert: true }
    ).populate("following.userFollowed");

    // Update the followed user's followers list
    await User.findByIdAndUpdate(
      req.body.userFollowed,
      {
        $push: {
          followers: { follower: req.user._id },
        },
        $push: {
          notifications: {
            senderId: req.user._id,
            message: `${req.user.username} started following you`,
            created: new Date(),
            viewProfile: false,
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "User followed successfully",
      following: user.following, // Return the updated following list
    });
  } catch (err) {
    console.error("Error following user:", err);
    res.status(500).json({
      message: "Error following user",
      error: err,
    });
  }
};

const UnFollowUser = async (req, res) => {
  try {
    // Update the logged-in user's following list
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          following: { userFollowed: req.body.userFollowed },
        },
      },
      { new: true, upsert: true }
    ).populate("following.userFollowed");

    // Update the followed user's followers list
    await User.findByIdAndUpdate(
      req.body.userFollowed,
      {
        $pull: {
          followers: { follower: req.user._id },
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "User followed successfully",
      following: user.following, // Return the updated following list
    });
  } catch (err) {
    console.error("Error following user:", err);
    res.status(500).json({
      message: "Error following user",
      error: err,
    });
  }
};

const MarkNotification = async (req, res) => {
  if (!req.body.deleteValue) {
    await User.findByIdAndUpdate(
      {
        _id: req.users._id,
        "notifications._id": req.params.id,
      },
      {
        $set: { "notifications.$.read": true },
      }
    )
      .then(() => {
        res.status(200).json({
          message: "Notification marked as read",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Error marking notification as read",
          error: err,
        });
      });
  } else {
    await User.update(
      {
        _id: req.params.id,
        "notifications._id": req.params.id,
      },
      {
        $pull: { notifications: { _id: req.params.id } },
      }
    )
      .then(() => {
        res.status(200).json({
          message: "Deleted notification",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Error Deleting notification",
          error: err,
        });
      });
  }
};

const MarkAllNotification = async (req, res) => {
  await User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      arrayFilters: [{ "elem.read": false }],
      multi: true,
    },
    {
      $set: { "notifications.$[elem].read": true }, //to update multiplefield
    }
  )
    .then(() => {
      res.status(200).json({
        message: "Marked all successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error Deleting notification",
        error: err,
      });
    });
};

module.exports = {
  FollowUser,
  UnFollowUser,
  MarkNotification,
  MarkAllNotification,
};
