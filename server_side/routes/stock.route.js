const express = require("express");
const router = express.Router();
const Stock = require("../models/stock");
const Achat = require("../models/achat");
const mongoose = require('mongoose');
//const Vente = require("../models/vente");

router.get('/produits/quantite-actuelle', async (req, res) => {
    try {
        // Récupérer toutes les entrées et sorties de stock avec les informations des produits
        const stocks = await Stock.find().populate('produits.produit_id').exec();

        // Objet pour stocker les quantités par produit_id
        const productQuantities = {};

        // Parcourir toutes les entrées de stock pour calculer la quantité actuelle
        stocks.forEach(stock => {
            stock.produits.forEach(produit => {
                const produitId = produit.produit_id._id.toString(); // Convertir l'ID du produit en chaîne
                
                // Si le produit n'existe pas encore dans productQuantities, on l'initialise
                if (!productQuantities[produitId]) {
                    productQuantities[produitId] = {
                        produit_id: produit.produit_id._id,
                        label: produit.produit_id.label,
                        quantite_actuelle: 0 // Initialiser la quantité actuelle à 0
                    };
                }

                // Ajouter les quantités d'entrée et soustraire les quantités de sortie
                productQuantities[produitId].quantite_actuelle += (produit.quantite_entree || 0) - (produit.quantite_sortie || 0);
            });
        });

        // Convertir productQuantities en tableau pour la réponse JSON
        const result = Object.values(productQuantities);
         // Trier par ordre alphabétique selon le label
         result.sort((a, b) => a.label.localeCompare(b.label));
        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de la récupération des quantités actuelles des produits:", error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// Afficher la liste des stocks triés par date d'entrée (du plus récent au plus ancien)
router.get("/in", async (req, res) => {
    try {
        const stocks = await Stock.find({})
            .populate({
                path: 'produits.produit_id',
                model: 'Produit'
            })
            .populate({
                path: 'fournisseur_id',
                model: 'Fournisseur'
            })
            .populate({
                path: 'client_id',
                model: 'Client'
            })
            .sort({ date_entree: -1 }); // Trier par date_entree, du plus récent au plus ancien

            // Calculer la quantité totale pour chaque produit
            stocks.forEach(stock => {
                stock.produits.forEach(produit => {
                    produit._doc.quantite_total = produit.quantite_entree - produit.quantite_sortie;
                });
            });

        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Afficher la liste des stocks triés par date de sortie (du plus récent au plus ancien)
router.get("/out", async (req, res) => {
    try {
        const stocks = await Stock.find({})
            .populate({
                path: 'produits.produit_id',
                model: 'Produit'
            })
            .populate({
                path: 'fournisseur_id',
                model: 'Fournisseur'
            })
            .populate({
                path: 'client_id',
                model: 'Client'
            })
            .sort({ date_sortie: -1 }); // Trier par date_sortie, du plus récent au plus ancien

             // Calculer la quantité totale pour chaque produit
            stocks.forEach(stock => {
                stock.produits.forEach(produit => {
                    produit._doc.quantite_total = produit.quantite_entree - produit.quantite_sortie;
                });
            });

        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Afficher les stocks pour un produit spécifique
router.get("/produit/:produit_id", async (req, res) => {
    try {
        const { produit_id } = req.params;

        // Vérifiez si l'ID du produit est valide
        if (!mongoose.Types.ObjectId.isValid(produit_id)) {
            return res.status(400).json({ message: "ID de produit invalide" });
        }

        const stock = await Stock.findOne({ "produits.produit_id": produit_id })
            .populate('produits.produit_id', 'label description')
            .populate('fournisseur_id', 'nom')
            .populate('client_id', 'nom');

        if (!stock) {
            return res.status(404).json({ message: "Stock non trouvé pour ce produit" });
        }

        res.status(200).json(stock);
    } catch (error) {
        console.error("Erreur lors de la recherche du stock :", error);
        res.status(500).json({ message: error.message });
    }
});



// Afficher un stock par ID
router.get("/out/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const stock = await Stock.findOne({ "produits.id": id })
            .populate({
                path: 'produits.produit_id',
                model: 'Produit'
            })
            .populate({
                path: 'fournisseur_id',
                model: 'Fournisseur'
            })
            .populate({
                path: 'client_id',
                model: 'Client'
            });

        if (!stock) {
            return res.status(404).json({ message: "Stock non trouvé" });
        }

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/in/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const stock = await Stock.findOne({ "produits.id": id })
            .populate({
                path: 'produits.produit_id',
                model: 'Produit'
            })
            .populate({
                path: 'fournisseur_id',
                model: 'Fournisseur'
            })
            .populate({
                path: 'client_id',
                model: 'Client'
            });

        if (!stock) {
            return res.status(404).json({ message: "Stock non trouvé" });
        }

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour créer un stock de sortie
router.post('/out', async (req, res) => {
    try {
        const { client_id, produits } = req.body;

        // Pour chaque produit, récupérer la quantité actuelle et la mettre à jour
        for (let produit of produits) {
            // Récupérer le stock actuel pour ce produit
            const stockResponse = await Stock.findOne({
                'produits.produit_id': produit.produit_id
            }).sort({ date_sortie: -1 });

            const quantiteActuelle = stockResponse ? stockResponse.produits.find(p => p.produit_id.equals(produit.produit_id)).quantite_actuelle : 0;

            // Calculer la nouvelle quantité actuelle après la sortie
            produit.quantite_entree = produit.quantite_entree || 0;
            produit.quantite_sortie = produit.quantite_sortie || 0;
            produit.quantite_actuelle = quantiteActuelle - produit.quantite_sortie;

            // Vérifier si la quantité actuelle reste positive
            if (produit.quantite_actuelle < 0) {
                return res.status(400).json({ message: `Quantité actuelle négative pour le produit ID ${produit.produit_id}` });
            }
        }

        const newStock = new Stock({
            client_id,
            produits,
            date_sortie: new Date(),
        });

        await newStock.save();
        res.status(201).json(newStock);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Route pour créer un stock d'entrée
router.post('/in', async (req, res) => {
    try {
        const { fournisseur_id, produits } = req.body;

        // Pour chaque produit, récupérer la quantité actuelle et la mettre à jour
        for (let produit of produits) {
            // Récupérer le stock actuel pour ce produit
            const stockResponse = await Stock.findOne({
                'produits.produit_id': produit.produit_id
            }).sort({ date_entree: -1 });

            const quantiteActuelle = stockResponse ? stockResponse.produits.find(p => p.produit_id.equals(produit.produit_id)).quantite_actuelle : 0;

            // Calculer la nouvelle quantité actuelle
            produit.quantite_entree = produit.quantite_entree || 0;
            produit.quantite_sortie = produit.quantite_sortie || 0;
            produit.quantite_actuelle = quantiteActuelle + produit.quantite_entree;
        }

        const newStock = new Stock({
            fournisseur_id,
            produits,
            date_entree: new Date(),
        });

        // Sauvegarde du stock
        await newStock.save();

        // Réponse de succès
        res.status(201).json(newStock);
    } catch (err) {
        // Gestion des erreurs
        res.status(400).json({ message: err.message });
    }
});



// Modifier un stock
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // Met à jour le stock uniquement si les produits sont fournis
        const updatedStock = await Stock.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedStock) {
            return res.status(404).json({ message: "Stock non trouvé" });
        }

        res.status(200).json(updatedStock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un stock
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const stock = await Stock.findById(id);

        if (!stock) {
            return res.status(404).json({ message: "Stock non trouvé" });
        }

        // Mettre à jour les quantités des produits après suppression
        for (let produit of stock.produits) {
            const produitDoc = await Produit.findById(produit.produit_id);
            if (produitDoc) {
                produitDoc.quantite_total -= produit.quantite_entree - produit.quantite_sortie;
                await produitDoc.save();
            }
        }

        // Supprimer le stock
        await Stock.findByIdAndDelete(id);
        res.status(200).json("Stock supprimé avec succès");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
