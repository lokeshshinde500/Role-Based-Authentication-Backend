import userModel from "../models/userModel.js";

// get all users
export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    // Users not found!
    if (!users) {
      return res.status(404).json({
        message: "Users not found!",
        success: false,
      });
    }

    return res.status(200).json({
      users,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: error.message,
    });
  }
};

// delete user by id
export const deleteUser = async (req, res) => {
  try {
    // can't delete self
    if (req.user.id === req.params.userId) {
      return res.status(400).json({
        message: "You can't delete yourself!",
        success: false,
      });
    }

    const user = await userModel.findByIdAndDelete(req.params.userId);

    // User not found!
    if (!user) {
      return res.status(404).json({
        message: "Users not found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User deleted successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: error.message,
    });
  }
};
