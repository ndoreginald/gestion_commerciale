const express = require("express");
const router = express.Router();

const Fournisseur = require("../models/fournisseur");

// Afficher la liste des fournisseurs
router.get("/", async (req, res) => {
    try {
        const fournisseurs = await Fournisseur.find({}, null, { sort: { nom: "asc" } });
        res.status(200).json(fournisseurs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Afficher un fournisseur par ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Récupère l'ID de l'URL
        const fournisseur = await Fournisseur.findById(id); // Recherche le fournisseur par son ID

        if (!fournisseur) {
            return res.status(404).json({ message: "Fournisseur non trouvé" });
        }

        res.status(200).json(fournisseur); // Retourne les informations du fournisseur
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gère les erreurs
    }
});

// Route pour créer un fournisseur
router.post("/", async (req, res) => {
    try {
        const { nom, email, adresse, telephone } = req.body;
        const newFournisseur = new Fournisseur(req.body);
        await newFournisseur.save();
        res.status(201).json(newFournisseur);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Modifier un fournisseur
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const updatedFournisseur = await Fournisseur.findByIdAndUpdate(
            id, 
            { $set: req.body }, 
            { new: true }
        );
        res.status(200).json(updatedFournisseur);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Supprimer un fournisseur
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await Fournisseur.findByIdAndDelete(id);
        res.status(200).json("Fournisseur deleted successfully");
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
