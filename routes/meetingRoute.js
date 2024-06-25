const express = require('express');
const {
  createMeeting,
  getAllMeetings,
  getMeetingById ,
  updateMeeting,
  deleteMeeting,
  getAllParticipant,
}=require("../services/meetingSevice")

const router = express.Router();

router.post('/', createMeeting);
router.get('/', getAllMeetings);
router.get('/paticipant', getAllParticipant);
router.get('/:id', getMeetingById);
router.put('/:id', updateMeeting);
router.delete('/:id', deleteMeeting);

module.exports = router;
