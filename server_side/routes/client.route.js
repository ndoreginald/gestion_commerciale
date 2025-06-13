const express = require("express");
const router = express.Router();

const client = require("../models/client");


// Afficher la liste des clients
router.get("/", async (req, res) => {
    try {
        const clients = await client.find({}, null, { sort: { nom: "asc" } });
        res.status(200).json(clients);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


// Afficher un client par ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Récupère l'ID de l'URL
        const client = await Client.findById(id); // Recherche le client par son ID

        if (!client) {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        res.status(200).json(client); // Retourne les informations du client
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gère les erreurs
    }
});

  
// Route pour créer un client
router.post('/', async (req, res) => {
    try {
        const { nom, email, adresse, telephone, statut} = req.body;
        const newClient = new client(req.body);
        await newClient.save();
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Modifier un utilisateur
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedClient = await client.findByIdAndUpdate(
            id, 
            { $set: req.body }, 
            { new: true }
        );
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(404).json({ "message": error.message });
    }
});

// Supprimer un client
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await client.findByIdAndDelete(id);
        res.status(200).json("Client deleted successfully");
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


module.exports = router;