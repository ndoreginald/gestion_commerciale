const express = require("express");
const router = express.Router();
const Vente = require("../models/vente");
const Stock = require("../models/stock");
const mongoose = require("mongoose");

// Afficher la liste des ventes
router.get("/", async (req, res) => {
    try {
        const ventes = await Vente.find({})
            .populate('produits.produit_id')
            .populate('client_id')
            .sort({ date_vente: -1 });

        res.status(200).json(ventes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Obtenir le dernier numéro de vente
router.get("/next-num-vente", async (req, res) => {
  try {
    const lastVente = await Vente.findOne().sort({ num_vente: -1 }).exec();
    const nextNumVente = lastVente ? lastVente.num_vente + 1 : 1;
    res.status(200).json({ nextNumVente });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour créer une vente
router.post('/', async (req, res) => {
    try {
        const newVente = new Vente(req.body);
        await newVente.save();
        res.status(201).json(newVente);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Modifier une vente
/*
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedVente = await Vente.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedVente);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
*/

router.put('/:id', async (req, res) => {
    try {
      const { produits, statut } = req.body;
      
      const vente = await Vente.findById(req.params.id);
      if (!vente) {
        return res.status(404).send('Vente non trouvée');
      }
  
      vente.produits = produits; // Mettez à jour les produits
      vente.statut = statut; // Mettez à jour le statut si nécessaire
      await vente.save();
  
      if (statut === 'Confirmé') {
        for (const produitVente of produits) {
          const { produit_id, quantite } = produitVente;
  
          let stock = await Stock.findOne({ "produits.produit_id": produit_id });
  
          if (stock) {
            const produitStock = stock.produits.find(p => p.produit_id.equals(produit_id));
            produitStock.quantite_sortie += quantite;
            produitStock.quantite_total += quantite;
          } else {
            stock = new Stock({
              client_id: vente.fournisseur_id,
              produits: [{
                produit_id: produit_id,
                quantite_entree: 0,
                quantite_sortie: quantite,
                quantite_total: quantite,
              }],
              date_sortie: vente.date_vente
            });
          }
  
          await stock.save();
        }
      }
  
      res.status(200).send(vente);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la vente :', error);
      res.status(500).send('Erreur lors de la mise à jour de la vente');
    }
  });
  


// Supprimer une vente
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await Vente.findByIdAndDelete(id);
        res.status(200).json("Vente supprimée avec succès");
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/monthly-sales', async (req, res) => {
  try {
    const aggregatedData = await Vente.aggregate([
      { $unwind: "$produits" },
      {
        $group: {
          _id: {
            year: { $year: "$date_vente" },
            month: { $month: "$date_vente" },
          },
          totalSales: { $sum: "$produits.total" },
        },
      },
     
      { $sort: { "_id.year": 1, "_id.month": 1 } },    
    ]);

    res.json(aggregatedData);
  } catch (error) {
    console.error('Error in aggregation:', error); // Débogage des erreurs
    res.status(500).json({ error: error.message });
  }
});

router.get("/sales", async (req, res) => {
  try {
    const aggregatedData = await Vente.aggregate([
      { $unwind: "$produits" },
      { 
        $group: { 
          _id: "$produits.produit_id", 
          totalQuantity: { $sum: "$produits.quantite" } 
        } 
      },
      { $sort: { totalQuantity: -1 } },
      {
        $lookup: {
          from: "produits", // Le nom de la collection de produits
          localField: "_id", // `_id` ici est `produit_id`
          foreignField: "_id", // `_id` dans la collection `Produit`
          as: "produitDetails" // Le nom du champ qui contiendra les détails du produit
        }
      },
      {
        $unwind: "$produitDetails" // Décompose le tableau `produitDetails` pour obtenir un objet unique
      },
      {
        $project: {
          _id: 1, // Garde `_id` qui est `produit_id`
          totalQuantity: 1,
          name: "$produitDetails.label" // Renomme le `label` en `name`
        }
      }
    ]);
    
    res.json(aggregatedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/top-sales-date', async (req, res) => {
  try {
    const aggregatedData = await Vente.aggregate([
      { $unwind: "$produits" },
      {
        $group: {
          _id: {
            year: { $year: "$date_vente" },
            month: { $month: "$date_vente" },
            day: { $dayOfMonth: "$date_vente" }
          },
          totalQuantity: { $sum: "$produits.quantite" },
        }
      },
      {
        $sort: { totalQuantity: -1 }
      },
      {
        $group: {
          _id: { year: "$_id.year", month: "$_id.month" },
          topDate: { $first: "$_id" },
          topQuantity: { $first: "$totalQuantity" }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          day: "$topDate.day",
          totalQuantity: "$topQuantity"
        }
      }
    ]);

    res.json(aggregatedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/client-sales', async (req, res) => {
  try {
    const aggregatedData = await Vente.aggregate([
      { $unwind: "$produits" },
      { $group: { _id: "$client_id", totalAmount: { $sum: "$produits.total" } } },
      { $lookup: {
          from: "clients", // Nom de la collection des clients
          localField: "_id",
          foreignField: "_id",
          as: "clientInfo"
        }
      },
      { $unwind: "$clientInfo" },
      { $project: {
          _id: 0,
          clientId: "$_id",
          clientName: "$clientInfo.nom", // Utilise le champ 'nom' du modèle Client
          totalAmount: 1
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.json(aggregatedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Afficher une vente par ID
router.get("/:id", async (req, res) => {
  try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }
      const vente = await Vente.findById(id)
      .populate('produit_id')
      .populate('client_id');

      if (!vente) {
          return res.status(404).json({ message: "Vente non trouvée" });
      }

      res.status(200).json(vente);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


module.exports = router;
