const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Crée le schéma produit
const produitSchema = new Schema({
    label: { type: String, required: true },
    description: { type: String, required: false },
    prix_achat: { type: Number , default: 0 , required: true },
    prix_vente: { type: Number , required: true },
    image: { type: String },
    quantite_initiale: { type: Number, default: 0 },
    categorie_id: { type: Schema.Types.ObjectId, ref: "Categorie", required: true }, // Référence à la catégorie
    code_barre: { type: String, required: true, unique: false },
   //code_barre: { type: String, required: true, unique: true, default: async function() {return await generateUniqueCodeBarre();}},
    date_creation: { type: Date, default: Date.now },
    date_modification: { type: Date, default: Date.now },
    statut: { type: String, enum: ["actif", "inactif"], default: "actif" }
});

// Fonction pour générer un code-barre unique
/*
async function generateUniqueCodeBarre() {
    let codeBarre;
    let exists = true;
    
    while (exists) {
        // Générer un code-barre unique (par exemple, un UUID ou une chaîne aléatoire)
        codeBarre = `CB-${Math.floor(100000 + Math.random() * 900000)}`; 
        
        // Vérifier si le code-barre existe déjà dans la base de données
        const existingProduct = await mongoose.model("Produit").findOne({ code_barre: codeBarre });
        exists = !!existingProduct;
    }

    return codeBarre;
}
*/

module.exports = mongoose.model("Produit", produitSchema);
