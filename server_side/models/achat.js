const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Crée le schéma d'achat
const achatSchema = new Schema({
    fournisseur_id: { type: Schema.Types.ObjectId, ref: "Fournisseur", required: true }, // Référence au fournisseur
    date_achat: { type: Date, required: true, default: Date.now },
    num_achat: { type: Number,required: true, unique: true},
    produits: [
        {
            produit_id: { type: Schema.Types.ObjectId, ref: "Produit", required: true }, // Référence au produit
            quantite: { type: Number, required: true },
            prix_unitaire: { type: Number, required: true }, // Prix unitaire lors de l'achat
            total: { type: Number, required: true }, // Prix total pour ce produit
        }
    ],
    statut: { type: String, enum: ["Commandé","En cours de livraison", "annuler", "confirmé"], default: "Commandé" },
    remise: { type: Number,default: 0, },
    taxes: { type: Number,default: 0,},
    total_ht: { type: Number,required: true,default: 0,  },
    total_ttc: { type: Number, required: true, default: 0, },
});


module.exports = mongoose.model("Achat", achatSchema);
