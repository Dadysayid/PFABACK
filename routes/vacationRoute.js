const express = require('express');
const {
  getVacations,
  createVacation,
  updateVacation,
  deleteVacation,
  getVacation,
  getVacationsFil,
  getVactionsEmploye,
} = require('../services/vactionService');

const router = express.Router();

// Route pour récupérer toutes les vacances, avec la possibilité de filtrer par statut
router.route('/').get(getVacations);
router.route('/vacation').get(getVactionsEmploye)                
  // Route pour récupérer les vacances de l'employé connecté, avec possibilité de filtrer par statut
router.route('/my-vacations').get(getVacationsFil);

// Autres routes pour créer, mettre à jour, récupérer et supprimer une seule vacance
router.route('/:id').get(getVacation).put(updateVacation).delete(deleteVacation);

// Route pour créer une nouvelle vacance
router.route('/').post(createVacation);

module.exports = router;
