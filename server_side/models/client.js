const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Crée le schéma utilisateur
const clientSchema = new Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: false },
    statut: { type: String, enum: ["Bloqué", "Actif"], default: "Actif" },
});




module.exports = mongoose.model("Client", clientSchema);
