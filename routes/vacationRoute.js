const express = require('express');

const {
  getVacations,
 
  createVacation,
  updateVacation,
  deleteVacation,
  getVacation,


} = require('../services/vactionService');



const router = express.Router();


router
  .route('/')
  .get(getVacations)
  .post(createVacation);
 router
  .route('/:id')
  .get(getVacation)
  .put( updateVacation)
  .delete(deleteVacation);

module.exports = router;
