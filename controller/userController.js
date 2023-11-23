const userModel = require("../models/userModel");

// create user registeruser
exports.registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //validation
    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }
    //existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        success: false,
        message: "user already exists",
      });
    }
    //save a new user
    const user = new userModel({ username, email, password });
    await user.save();
    return res.status(201).send({
      success: true,
      message: "new user created",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      message: "error",
      success: false,
    });
  }
};

//get all users

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      userCount: users.length,
      success: true,
      message: true,
      users,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in get all users",
      error,
    });
  }
};

//login
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "please provide email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "email is not registered",
      });
    }
    //password
    const isMatch = password === user.password ? true : false;
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "invalid username or password",
      });
    }
    return res.status(200).send({
      success: true,
      message: "login successfully",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in login callback",
      error,
    });
  }
};
