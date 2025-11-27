const User = require("../models/UsersModel");
const getUsers = async () => {
  try {
    const users = await User.find().select("-hash -__v -avatar_public_id");
    if (users.length == 0) {
      return new Error("No users found");
    }
    return users;
  } catch (err) {
    console.log("Error: ", err)
    throw new Error(err.message);
  }
};

const approveUser = async (user_id) => {
    try{
        const user = await User.findById(user_id)
        if(!user){
            return new Error("User not found")
        }

        // approve user
        await User.findByIdAndUpdate(user_id, {
            status: "approved"
        })
    }catch(err){
        throw new Error(err.message)
    }
}

module.exports = {getUsers, approveUser}
