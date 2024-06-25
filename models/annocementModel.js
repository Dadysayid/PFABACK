const mongoose = require('mongoose');

const annocemntSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title required'],
    },
    content: {
      type: String,
      required: [true, 'Content required'],
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', annocemntSchema);

module.exports = Announcement;
