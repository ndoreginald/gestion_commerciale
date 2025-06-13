const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Crée le schéma categorie
const categorieSchema = new Schema({
    nom: { type: String, required: true, unique: true }, // Le nom de la catégorie doit être unique
    description: { type: String, required: false }, // Une description optionnelle de la catégorie
    date_creation: { type: Date, default: Date.now }, // La date de création de la catégorie
    produits: [{
        produit_id: { type: Schema.Types.ObjectId, ref: "Produit" , required: false},
        //label: { type: String, required: true },
        //description: { type: String, required: false },
        //prix_vente: { type: Number , required: true },
        //image: { type: String },
        //code_barre: { type: String, required: true, unique: true },
        //date_creation: { type: Date, default: Date.now },
        }]
});

module.exports = mongoose.model("Categorie", categorieSchema);
