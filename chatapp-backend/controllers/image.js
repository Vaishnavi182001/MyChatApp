const cloudinary = require("cloudinary");
const User = require("../models/userModels"); // change from Helpers/UserClass to models/User

cloudinary.config({
  cloud_name: "dckvwo8sp",
  api_key: "347991317796349",
  api_secret: "a0Rj1o4TUQIgzaToocDxOihUsGU",
});

module.exports = {
  UploadImage(req, res) {
    cloudinary.v2.uploader.upload(req.body.image, async (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ message: "Image upload failed", error });
      }
      if (!result) {
        return res.status(500).json({ message: "No result from Cloudinary." });
      }
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.userId },
          {
            $set: {
              picId: result.public_id,
              picVersion: result.version,
            },
            $push: {
              images: {
                imageId: result.public_id,
                imageVersion: result.version,
              },
            },
          },
          { new: true }
        );
        res.status(200).json({
          message: "Image uploaded successfully",
          result: updatedUser,
        });
      } catch (dbError) {
        console.error("Database update error:", dbError);
        res
          .status(500)
          .json({ message: "Database update failed", error: dbError });
      }
    });
  },
};
