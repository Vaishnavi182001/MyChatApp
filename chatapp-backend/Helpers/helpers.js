const User = require('../models/userModels'); // Adjust the path as needed

const firstUpper = (username) => {
    const name = username.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
}

const lowerCase = (email) => {
    if (typeof email === 'string') {
        return email.toLowerCase();
    }
    console.error("Email is undefined or not a string:", email);
    throw new TypeError("Email is undefined or not a string");
}

const updateCheckList = async (req, message) => {
    await User.updateOne(
        {
            _id: req.user._id,
        },
        {
            $pull: {
                chatList: {
                    receiverId: req.params.receiver_Id
                }
            }
        }
    );

    await User.updateOne(
        {
            _id: req.params.receiver_Id,
        },
        {
            $pull: {
                chatList: {
                    receiverId: req.user._id
                }
            }
        }
    );


     await User.updateOne(
              {
                _id: req.user._id
              },
              {
                $push:{
                  chatList:{
                    $each:[
                      {
                        receiverId: req.params.receiver_Id,
                        msgId: message._id
                      }
                    ],
                    $position:0
                  }
                }
              }
            );

            await User.updateOne(
              {
                _id: req.params.receiver_Id
              },
              {
                $push:{
                  chatList:{
                    $each:[
                      {
                        receiverId: req.user._id,
                        msgId: message._id
                      }
                    ],
                    $position:0
                  }
                }
              }
            );
};

module.exports = { firstUpper, lowerCase, updateCheckList };