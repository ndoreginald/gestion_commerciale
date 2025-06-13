const mongoose = require("mongoose");
const Produit = require("./produit");
const Schema = mongoose.Schema;

// Crée le schéma stock
const stockSchema = new Schema({
    fournisseur_id: { type: Schema.Types.ObjectId, ref: "Fournisseur", required: false }, // Référence au fournisseur
    client_id: { type: Schema.Types.ObjectId, ref: "Client", required: false }, // Référence au client, facultatif en fonction de l'utilisation
    produits: [
        {
            produit_id: { type: Schema.Types.ObjectId, ref: "Produit", required: true }, // Référence au produit
            quantite_entree: { type: Number, default: 0, required: true }, // Quantité entrée pour le produit
            quantite_sortie: { type: Number, default: 0, required: true }, // Quantité sortie pour le produit
            quantite_actuelle: { type: Number, default: 0, required: false },
            categorie_id: { type: Schema.Types.ObjectId, ref: "Categorie", required: true }, // Référence à la catégorie
            // La quantité totale n'est pas nécessaire ici; elle peut être calculée dynamiquement
        }
    ],
    date_entree: { type: Date, required: false }, // Date à laquelle le produit a été ajouté au stock
    date_sortie: { type: Date, required: false }, // Date à laquelle le produit a été retiré du stock, si applicable
    emplacement: { type: String, required: false }, // Emplacement des produits dans le stock
});



module.exports = mongoose.model("Stock", stockSchema);
