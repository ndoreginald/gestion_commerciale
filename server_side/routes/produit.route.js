const express = require("express");
const router = express.Router();
const produit = require("../models/produit");
const { v4: uuidv4 } = require("uuid");

// Afficher la liste des produits avec les détails de la catégorie
router.get("/", async (req, res) => {
    try {
        // Utilisation de 'populate' pour inclure les détails de la catégorie
        const produits = await produit.find({}, null, { sort: { nom: "asc" } })
            .populate('categorie_id', 'nom') // 'nom' est le champ que vous souhaitez récupérer de la collection 'Categorie'
            .sort({ 'categorie_id.nom': 'asc', 'label': 'asc' });

        res.status(200).json(produits);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


// Afficher un produit par ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const newProduit = await produit.findById(id);

        if (!newProduit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        res.status(200).json(newProduit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
       const codeBarre = uuidv4(); // Génère un code-barre unique
       const newProduit = new produit({ ...req.body, code_barre: codeBarre });
        //const newProduit = new Produit(req.body);
        await newProduit.save();
        res.status(201).json(newProduit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Modifier un produit
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedProduit = await produit.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedProduit);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Supprimer un produit
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await produit.findByIdAndDelete(id);
        res.status(200).json("Produit supprimé avec succès");
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Route pour récupérer les données des produits
router.get('/products-prices', async (req, res) => {
    try {
      // Récupère tous les produits avec uniquement les champs nécessaires
      const products = await produit.find({}, { label: 1, prix_achat: 1, prix_vente: 1 });
  
      // Retourne les données en format JSON pour être utilisé dans un graphe
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });



module.exports = router;
