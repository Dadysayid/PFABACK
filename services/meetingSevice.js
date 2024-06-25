const Meeting = require('../models/meetingModel');
const ApiError = require('../utils/apiError');

// Créer une réunion
exports.createMeeting = async (req, res, next) => {
  try {
    const { participants, time, date } = req.body;

    // Check for existing meetings with participants at the same time and date
    const conflicts = await Meeting.find({
      participants: { $in: participants },
      time,
      date
    });

    if (conflicts.length > 0) {
      throw new ApiError('One of the participants already has a meeting at this time and date.', 400);
    }

    const meeting = await Meeting.create(req.body);
    res.status(201).json({ data: meeting });
  } catch (error) {
    next(error);
  }
};

// Obtenir toutes les réunions
exports.getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find().populate('participants', { name: 1, prenom: 1, _id: 1, post: 1 });
    res.status(200).json({ data: meetings });
  } catch (error) {
    next(error);
  }
};

// Obtenir toutes les réunions pour un participant donné
exports.getAllParticipant = async (req, res, next) => {
  try {
    const { id } = req.query;
    const meetings = await Meeting.find({ participants: id });
    res.status(200).json({ data: meetings });
  } catch (error) {
    next(error);
  }
};

// Obtenir une réunion par son identifiant
exports.getMeetingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id).populate('participants');
    if (!meeting) {
      throw new ApiError(`Réunion avec l'identifiant ${id} non trouvée.`, 404);
    }
    res.status(200).json({ data: meeting });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour une réunion
exports.updateMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedMeeting = await Meeting.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedMeeting) {
      throw new ApiError(`Réunion avec l'identifiant ${id} non trouvée.`, 404);
    }
    res.status(200).json({ data: updatedMeeting });
  } catch (error) {
    next(error);
  }
};

// Supprimer une réunion
exports.deleteMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedMeeting = await Meeting.findByIdAndDelete(id);
    if (!deletedMeeting) {
      throw new ApiError(`Réunion avec l'identifiant ${id} non trouvée.`, 404);
    }
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
