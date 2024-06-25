const Announcement = require('../models/annocementModel');
const ApiError = require('../utils/apiError');

// Create an announcement
exports.createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.create(req.body);
    res.status(201).json({ data: announcement });
  } catch (error) {
    next(error);
  }
};


// Get all announcements with pagination
exports.getAllAnnouncements = async (req, res, next) => {
  try {
    // Extract page and limit from query parameters, default to 1 and 10 respectively
    console.log(req.query)

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    
    // Calculate the offset (skip) based on the page number and limit
    const skip = (page - 1) * limit;
    // Query the database to get announcements with pagination
    const announcements = await Announcement.find()
      .skip(skip)
      .limit(limit);
      const countVac=await Announcement.countDocuments()
      const totalPages=Math.ceil(countVac/limit)
    res.status(200).json({ data: announcements,total:totalPages });
  } catch (error) {
    next(error);
  }
};


// Get an announcement by ID
exports.getAnnouncementById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      throw new ApiError(`Announcement with ID ${id} not found.`, 404);
    }
    res.status(200).json({ data: announcement });
  } catch (error) {
    next(error);
  }
};

// Update an announcement
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedAnnouncement) {
      throw new ApiError(`Announcement with ID ${id} not found.`, 404);
    }
    res.status(200).json({ data: updatedAnnouncement });
  } catch (error) {
    next(error);
  }
};

// Delete an announcement
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    if (!deletedAnnouncement) {
      throw new ApiError(`Announcement with ID ${id} not found.`, 404);
    }
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
