const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DevisSchema = new Schema({


  client_id: { type: Schema.Types.ObjectId, ref: "Client",  required: true, },
  date_devis: { type: Date, default: Date.now,required: true,},
  validite: { type: Date, required: true, },
  num_devis: { type: Number,required: true, unique: true},
  etat: { type: String, enum: ["en cours", "accepté", "rejeté", "expiré"],default: "en cours", },
  produits: [
    {
      produit_id: { type: Schema.Types.ObjectId, ref: "Produit", required: true,  },
      quantite: { type: Number, required: true, min: 1, },
      prix_unitaire: { type: Number, required: true, },
      total: { type: Number, required: true, },
    },
  ],
  remise: { type: Number,default: 0, },
  taxes: { type: Number,default: 0,},
  total_ht: { type: Number,required: true,default: 0,  },
  total_ttc: { type: Number, required: true, default: 0, },
  //conditions_paiement: { type: String,default: "", },
  //utilisateur_id: { type: Schema.Types.ObjectId,ref: "Utilisateur",  required: true, },
  //reference: { type: String, unique: true,required: true, },

});

// Middleware pour calculer les totaux avant de sauvegarder
DevisSchema.pre('save', function (next) {
    let totalHT = 0;
  
    // Calcul du total HT (hors taxes)
    this.produits.forEach(produit => {
      produit.total_ligne = produit.quantite * produit.prix_unitaire;
      totalHT += produit.total_ligne;
    });
  
    this.total_ht = totalHT;
  
    // Calcul du total TTC (toutes taxes comprises)
    this.total_ttc = (totalHT - this.remise) * (1 + this.taxes / 100);
  
    next();
  });

module.exports = mongoose.model("Devis", DevisSchema);
