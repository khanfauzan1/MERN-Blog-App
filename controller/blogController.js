const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

// Get all blogs

exports.getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate('user');
    if (!blogs) {
      return res.status(200).send({
        success: false,
        message: "no blogs found",
      });
    }
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: "all blogs lists",
      blogs,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error while getting blogs",
      error,
    });
  }
};

//create blog

exports.createBlogController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    //validation
    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "please provide all fields ",
      });
    }

    const existingUser = await userModel.findById(user);
    //validation
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "unbable to find user",
      });
    }

    const newBlog = new blogModel({ title, description, image, user });
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });
    await session.commitTransaction();

    await newBlog.save();
    return res.status(201).send({
      success: true,
      message: "blog created",
      newBlog,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "error while creating blog",
      error,
    });
  }
};

//update blog
exports.updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "blog updated",
      blog,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "error while updating blog",
      error,
    });
  }
};
//single blog
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      res.status(404).send({
        success: false,
        message: "error while getting single blog",
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetch single blog",
      blog,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "error while getting single blog",
      error,
    });
  }
};

//delete blog
exports.deleteBlogController = async (req, res) => {
  try {
    const blog = await blogModel
      // .findOneAndDelete(req.params.id)
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: "blog deleted",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "error while deleting blog",
      error,
    });
  }
};

// GET user blog
exports.userBlogController = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate("blogs");
    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: "blogs not found with this id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user blogs",
      userBlog,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "error in user blog",
      error,
    });
  }
};
