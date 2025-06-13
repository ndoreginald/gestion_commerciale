const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');

const utilisateurRouter = require("./routes/utilisateur.route");
const clientRouter = require("./routes/client.route");
const produitRouter = require("./routes/produit.route");
const categorieRouter = require("./routes/categorie.route");
const fournisseurRouter = require("./routes/fournisseur.route");
const achatRouter = require("./routes/achat.route");
const venteRouter = require("./routes/vente.route");
const stockRouter = require("./routes/stock.route");
const devisRouter = require("./routes/devis.route");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Configure le middleware de session
app.use(session({
    secret: 'votre_secret_de_session', // Changez cela par une clé secrète sécurisée
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Utilisez `true` si vous utilisez HTTPS
}));



app.get("/",(req,res)=> {
   if(req.session.role){
    return res.json({valid:true , role:req.session.role})
   }else{
    return res.json({valid:false})
   }
} );

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/gestionDB/logout', (req, res) => {
  // Logique de déconnexion, par exemple, destruction de la session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
    res.status(200).json({ message: 'Déconnecté avec succès' });
  });
}); 


/*
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});
*/


app.get("/",(req,res)=> {
    res.send({"message":"Welcome to Server of gestionDB"});
} );


// Connect to MongoDB database
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DataBase Successfully Connected");
  })
  .catch((err) => {
    console.log("Unable to connect to database", err);
    process.exit();
  });

app.use("/gestionDB/utilisateur/",utilisateurRouter); 
app.use("/gestionDB/client/",clientRouter);  
app.use("/gestionDB/produit/",produitRouter); 
app.use("/gestionDB/categorie/",categorieRouter );
app.use("/gestionDB/fournisseur/",fournisseurRouter );
app.use("/gestionDB/achat/",achatRouter); 
app.use("/gestionDB/vente/",venteRouter); 
app.use("/gestionDB/stock/",stockRouter);
app.use("/gestionDB/devis/",devisRouter); 

app.listen(process.env.PORT, () => {
    console.log("Server listen to "+process.env.PORT);
} )

module.exports = app;