const mongoose = require('mongoose');

// Définition du schéma pour les vacances
const vactionSchema = new mongoose.Schema(
  {
    periode: Number,
    enddate: Date,
    strtdate: Date,
    typevaction: String,
    status: Boolean,
    employee: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required:true
    },
  },
  { timestamps: true }
);

// Création du modèle de vacances
const VactionModel = mongoose.model('Vaction', vactionSchema);

module.exports = VactionModel;
