const express = require("express");
const router = express.Router();
const Devis = require("../models/devis"); 
const cron = require('node-cron');


// Tâche cron qui s'exécute tous les jours à minuit
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    await Devis.updateMany({ validite: { $lt: today }, etat: { $ne: 'expiré' } }, { etat: 'expiré' });
    console.log('Statut des devis expirés mis à jour.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des devis expirés:', error);
  }
});

// Créer un nouveau devis
router.post("/", async (req, res) => {
  try {
    const lastDevis = await Devis.findOne().sort({ num_devis: -1 }).exec();
    const newNumDevis = lastDevis ? lastDevis.num_devis + 1 : 1;
    const newDevis = new Devis({ ...req.body, num_devis: newNumDevis });
    const savedDevis = await newDevis.save();
    res.status(201).json(savedDevis);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
  

// Récupérer tous les devis
router.get("/", async (req, res) => {
  try {
    const devis = await Devis.find().populate("client_id")//.populate("produit_id", 'label');
    .populate("produits.produit_id", "label")
    .sort({ date_devis: -1 });
    res.status(200).json(devis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Obtenir le dernier numéro de devis
router.get("/next-num-devis", async (req, res) => {
  try {
    const lastDevis = await Devis.findOne().sort({ num_devis: -1 }).exec();
    const latestNumDevis = lastDevis ? lastDevis.num_devis + 1 : 1;
    res.status(200).json({ latestNumDevis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour un devis par son ID
router.put("/:id", async (req, res) => {
  try {
    const updatedDevis = await Devis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDevis) return res.status(404).json({ message: "Devis non trouvé" });
    res.status(200).json(updatedDevis);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un devis par son ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedDevis = await Devis.findByIdAndDelete(req.params.id);
    if (!deletedDevis) return res.status(404).json({ message: "Devis non trouvé" });
    res.status(200).json({ message: "Devis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer un devis par son ID
router.get("/:id", async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id).populate("client_id").populate("utilisateur_id");
    if (!devis) return res.status(404).json({ message: "Devis non trouvé" });
    res.status(200).json(devis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
