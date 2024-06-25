const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');


const ApiError = require('../utils/apiError');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');

const User = require('../models/userModel');
exports.uploadUserImage = uploadSingleImage('profileImg');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});


// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers =  asyncHandler(async (req, res) => {
   
    const x=await User.find({role:req.query.role})

     
  

    res
      .status(200)
      // .json({ results: documents.length, paginationResult, data: documents });
      .json({data:x})
  });

  exports.getUsersPagin = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number, default is 1
    const limit = parseInt(req.query.limit) || 4; // Number of users per page, default is
    const skip = (page - 1) * limit; // Calculate the number of items to skip
    const posts=req.query.search || ""
    console.log("aaaaaaaaaaaaaaaaaa",posts)
    // Fetch users from the database with pagination
    const users = await User.find({ role: 'employe', $or: [ { post:{$regex:posts, $options: 'i'}}, { name:{$regex:posts, $options: 'i'}} ] })
      .skip(skip)
      .limit(limit);
  
    // Count total number of users for pagination

    const totalCount = await User.countDocuments({ role: 'employe', $or: [ { post:{$regex:posts, $options: 'i'}}, { name:{$regex:posts, $options: 'i'}} ] });
  
    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / limit);
  
    res.status(200).json({ data: users, totalPages });
  });
  

// // @desc    Get specific user by id
// // @route   GET /api/v1/users/:id
// // @access  Private/Admin
exports.getUser =  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: user });
  });






  exports.createUser = (async (req, res) => {
    console.log(req.body)
    if(!req.body?.password && req.body?.password?.trim().length<6)
    {
    return  res.json("password length should be minimum 6 caractere");

    }
    // const {nom,prenom
    //  // ,
    //   //...
    // }=req.body
    const user = await User.create(req.body);
    res.status(201).json({ data: user });
  });



 
  exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    // Trigger "save" event when update document
    user.save();
    res.status(200).json({ data: user });
  });



 

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }

  // Trigger "remove" event when update document
   user.remove();
  res.status(204).send();
});


// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});
