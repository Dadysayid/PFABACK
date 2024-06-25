const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'La date est requise'],
    },
    time: {
      type: String,
      required: [true, 'L\'heure est requise'],
    },
    salle: {
      type: String,
      required: [true, 'La salle est requise'],
    },
    title: {
      type: String,
     
    },
    
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true }
);

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
