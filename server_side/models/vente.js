const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Crée le schéma de vente
const venteSchema = new Schema({
    client_id: { type: Schema.Types.ObjectId, ref: "Client", required: true }, // Référence au client
    produits: [
        {
            label: { type: String, required: false , default:''},
            produit_id: { type: Schema.Types.ObjectId, ref: "Produit", required: true }, // Référence au produit
            quantite: { type: Number, required: true },
            prix_unitaire: { type: Number, required: true }, // Prix unitaire lors de l'achat
            total: { type: Number, required: true }, // Prix total pour ce produit
        }],
    date_vente: { type: Date, required: true, default: Date.now },
    statut: { type: String, enum: ["Envoyer", "En attente ","annuler","Confirmé"], default: "Envoyer" },
    num_vente: { type: Number,required: true, unique: true},
    remise: { type: Number,default: 0, },
    taxes: { type: Number,default: 0,},
    total_ht: { type: Number,required: true,default: 0,  },
    total_ttc: { type: Number, required: true, default: 0, },
    
});

module.exports = mongoose.model("Vente", venteSchema);
