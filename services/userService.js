const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');


const ApiError = require('../utils/apiError');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');

const User = require('../models/userModel');
const ApiFeatures = require('../utils/apiFaetures');
// Upload single image
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
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await User.countDocuments();
    const apiFeatures = new ApiFeatures(User.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
  
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
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


// // @desc    Create user
// // @route   POST  /api/v1/users
// // @access  Private/Admin



  exports.createUser = (async (req, res) => {
    console.log(req.body)
    if(req.body.password.trim().length<6)
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

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
// exports.updateUser = asyncHandler(async (req, res, next) => {
//   const document = await User.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       slug: req.body.slug,
//       phone: req.body.phone,
//       email: req.body.email,
//       profileImg: req.body.profileImg,
//       role: req.body.role,
//     },
//     {
//       new: true,
//     }
//   );

//   if (!document) {
//     return next(new ApiError(`No document for this id ${req.params.id}`, 404));
//   }
//   res.status(200).json({ data: document });
// });

  // const document = await User.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     name: req.body.name,
    //     slug: req.body.slug,
    //     phone: req.body.phone,
    //     email: req.body.email,
    //     profileImg: req.body.profileImg,
    //     role: req.body.role,
    //   },
    //   {
    //     new: true,
    //   }
    // );
  
    // if (!document) {
    //   return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    // }
    // res.status(200).json({ data: document });
  // });
 
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



 // constuser = await User.findByIdAndUpdate(
   //   req.params.id,
   //   {
   //     name: req.body.name,
   //     slug: req.body.slug,
   //     phone: req.body.phone,
   //     email: req.body.email,
   //     profileImg: req.body.profileImg,
   //     role: req.body.role,
   //   },
   //   {
   //     new: true,
   //   }
   // );
 
   // if (!document) {
   //   return next(new ApiError(`No document for this id ${req.params.id}`, 404));
   // }
   // res.status(200).json({ data: document });
//  });
// exports.changeUserPassword = asyncHandler(async (req, res, next) => {
//   const document = await User.findByIdAndUpdate(
//     req.params.id,
//     {
//       password: await bcrypt.hash(req.body.password, 12),
//       passwordChangedAt: Date.now(),
//     },
//     {
//       new: true,
//     }
//   );

//   if (!document) {
//     return next(new ApiError(`No document for this id ${req.params.id}`, 404));
//   }
//   res.status(200).json({ data: document });
// });

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

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
// exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
//   req.params.id = req.user._id;
//   next();
// });

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
// exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
//   // 1) Update user password based user payload (req.user._id)
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       password: await bcrypt.hash(req.body.password, 12),
//       passwordChangedAt: Date.now(),
//     },
//     {
//       new: true,
//     }
//   );

//   // 2) Generate token
//   const token = createToken(user._id);

//   res.status(200).json({ data: user, token });
// });

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
// exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//       phone: req.body.phone,
//     },
//     { new: true }
//   );

//   res.status(200).json({ data: updatedUser });
// });

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});
