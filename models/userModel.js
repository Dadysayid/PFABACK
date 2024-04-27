const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    prenom: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: {
      type: String,
      
    },
    post:String,

    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
    },
 
    role: {
      type: String,
      enum: ['employe', 'responsablerh', 'admin'],
      default: 'admin',
    },
   
    
    // child reference (one to many)
    // wishlist: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Product',
    //   },
    // ],
    // addresses: [
    //   {
    //     // id: { type: mongoose.Schema.Types.ObjectId },
    //     // alias: String,
    //     // details: String,
    //     // phone: String,
    //     city: String,
    //     postalCode: String,
    //   },
    // ],
  },
  { timestamps: true }
);


const User = mongoose.model('User', userSchema);

module.exports = User;
