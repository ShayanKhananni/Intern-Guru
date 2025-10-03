import User from "../models/user-model.js";
import { customError, imageUploder } from "../utils/utils.js";



export const logout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      res
      .clearCookie("refresh_token")
      .status(200)
      .json({ message: "Cookies Removed logout" });
  } catch (err) {
    next(err);
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    const { id, ...updatedProfile } = req.body; 

    if (req.file) {
      const imgUrl = await imageUploder(req);
      updatedProfile.photoURL = imgUrl; 
    }
    
    const updatedUser = await User.findByIdAndUpdate(id, updatedProfile, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedUser) {
      return next(customError(404,'User not found!'));
    }

    return res.status(200).json({ message: "Profile updated successfully",  updatedUser });

  } catch (err) {
    return next(err);
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.json({ message: "User Not found" });
    }
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};