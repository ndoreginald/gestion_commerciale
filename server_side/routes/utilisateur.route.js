const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const utilisateur = require("../models/utilisateur");

//Afficher la liste des utilisateurs
router.get("/", async (req,res) => {
    try {
        const users = await utilisateur.find({},null,{sort:{nom:"asc"}});
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
} );

// Afficher un utilisateur par ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Récupère l'ID de l'URL
        const utilisateur = await utilisateur.findById(id); // Recherche l'utilisateur par son ID

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(utilisateur); // Retourne les informations de l'utilisateur
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gère les erreurs
    }
});


// Route pour s'authentifier un utilisateur
router.post("/signIn", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await utilisateur.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      //const token = jwt.sign({ id: user._id, role: user.role }, process.env.TOKEN_KEY, { expiresIn: '1h' });
      
      // Stocker le token dans la session
      //req.session.token = token;
      //res.json({ token });
      res.status(200).json({ role: user.role }); // Renvoie également le rôle de l'utilisateur
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Route pour créer un utilisateur
router.post('/', async (req, res) => {
    try {
        const { nom, email, password, telephone } = req.body;
        const newUser = new utilisateur(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//modifier un utilisateur
router.put('/:id',async (req,res)=>{
    const id=req.params.id;
    try {
        // Vérifier si le champ password est modifié dans req.body
        if (req.body.password) {
            // Générer un salt pour le hachage
            const salt = await bcrypt.genSalt(10);
            // Hasher le nouveau mot de passe avec le salt
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const user =  await utilisateur.findByIdAndUpdate(
            id, 
            { $set: req.body } , 
            { new : true }
        ) ;
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ "message": error.message });
    }
});

//Supprimer un utilisateur
router.delete("/:id", async (req, res) =>{
    const id = req.params.id;
    await utilisateur.findByIdAndDelete(id);
    res.status(200).json("User deleted successfully");
});

// Route pour se déconnecter
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout' });
        }
        res.clearCookie('connect.sid'); // Optionnel
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;