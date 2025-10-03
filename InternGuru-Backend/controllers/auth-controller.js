import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import { customError } from "../utils/utils.js";
import jwt from "jsonwebtoken";
import Enrollment from "../models/enrollment_model.js";




export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    const saved = await newUser.save();
    if (!saved) return res.status(409).json({ message: "user already exist" });
    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    if (err.code === 11000) {
      if (err.keyValue && err.keyValue.email) {
        return next(customError(409, "Email already exists"));
      }
      return next(customError(409, "Username already exists"));
    }
    return next(customError(500, err.message || "Internal server error"));
  }
};


export const signinGoogle = async (req, res, next) => {
  try {
    const { displayName, email, photoURL } = req.body;
    
    let validUser = await User.findOne({ email });
    
    if (validUser) {

      const access_token = jwt.sign(
        { id: validUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const refresh_token = jwt.sign(
        { id: validUser._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("access_token", access_token, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.cookie("refresh_token", refresh_token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      

      const { password, createdAt, updatedAt, ...user } = validUser._doc;
      return res.status(200).json(user);
    }

    const username =
      displayName.split(" ").join("_").toLowerCase() +
      Math.floor(Math.random() * 10000 + 1);

    const hashedPassword = bcrypt.hashSync(
      Math.random().toString(36).slice(-8),
      10
    );

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      photoURL,
    });

    await newUser.save();

    const access_token = jwt.sign(
      { id: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refresh_token = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", access_token, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("refresh_token", refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const { password, createdAt, updatedAt, ...user } = newUser._doc;
    return res.status(201).json(user); // 201 for resource created

  } catch (err) {
    next(err);
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(customError(404, "User not Found"));

    const isValidPassword = bcrypt.compareSync(password, validUser.password);
    if (!isValidPassword) return next(customError(401, "Wrong Credentials"));

    // Build token payload
    const payload = {
      id: validUser._id.toString(),
      role: validUser.role,
    };

    // Convert user to plain object and omit sensitive fields
    const userObj = validUser.toObject();
    const { password: _, createdAt, updatedAt, __v, ...user } = userObj;

    // Add intern-specific info
    if (validUser.role === "intern") {
      const isEnrolled = await Enrollment.findOne({
        intern_id: validUser._id,
        isDeleted: false,
      });
      if (isEnrolled) {
        payload.isEnrolled = true;
        user.isEnrolled = true;
        user.internship_id = isEnrolled.internship_id;
        user.start_date = isEnrolled.start_date;
      }
    }


    // Sign access token
    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    // Sign refresh token with same payload info
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // Set cookies
    res.cookie("access_token", access_token, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("refresh_token", refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
