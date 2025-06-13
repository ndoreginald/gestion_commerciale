import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Paper, TextField, Typography, Button, Grid, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';  // Importez uuidv4
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function ProduitAdd() {
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    prix_vente: '',
    prix_achat: '',
    image: '',
    code_barre:  uuidv4(),  // Le code-barre sera généré automatiquement
    date_creation: new Date().toISOString().split('T')[0], // Date du jour formatée en AAAA-MM-JJ
    statut: 'actif',
    categorie_id: '',
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/gestionDB/categorie/`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setCategories(data);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des données :', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      code_barre:  '', // Génération automatique du code-barre
      prix_vente: parseFloat(formData.prix_vente),
      prix_achat: parseFloat(formData.prix_achat),
      date_creation: new Date(formData.date_creation).toISOString(),
    };
    try {
      const response = await axios.post('http://localhost:3001/gestionDB/produit/', data);
      setFormData({
        label: '',
        description: '',
        prix_vente: '',
        prix_achat: '',
        image: '',
        code_barre:   uuidv4(), 
        date_creation: new Date().toISOString().split('T')[0],
        statut: 'actif',
        categorie_id: '',
      });
      console.log('Produit ajouté avec succès:', response.data);
      alert('Produit ajouté avec succès');
      navigate('/products', { replace: true });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit :', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px', position: 'relative', height: '100vh' }}>
          <Header />
          <br />

          <Box
          sx={{
           // backgroundImage: `url('/img/produit.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          
          <Paper style={{ padding: '16px', maxWidth: '800px', margin: 'auto' , backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
          <Typography variant="h4" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0', textDecoration: 'underline' }}>
              Saisir les informations du nouveau produit
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    id="label"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    label="Label du produit"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    label="Description"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="number"
                    id="prix_vente"
                    name="prix_vente"
                    value={formData.prix_vente}
                    onChange={handleChange}
                    label="Prix Vente"
                    fullWidth
                    required
                    inputProps={{
                      min: 1, // Valeur minimale autorisée
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="number"
                    id="prix_achat"
                    name="prix_achat"
                    value={formData.prix_achat}
                    onChange={handleChange}
                    label="Prix Achat"
                    fullWidth
                    required
                    inputProps={{
                      min: 1, // Valeur minimale autorisée
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    label="Image URL"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    id="code_barre"
                    name="code_barre"
                    value={formData.code_barre}  // Le champ code_barre peut rester vide ou affiché automatiquement
                    onChange={handleChange}
                    label="Code barre"
                    fullWidth
                    required
                    InputProps={{ readOnly: true }}  // Le champ peut être en lecture seule pour l'utilisateur
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    id="date_creation"
                    name="date_creation"
                    value={formData.date_creation}
                    onChange={handleChange}
                    label="Date de création"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Catégorie"
                    name="categorie_id"
                    value={formData.categorie_id}
                    onChange={handleChange}
                    fullWidth
                    required
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>{cat.nom}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    id="statut"
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    label="Statut"
                    fullWidth
                    required
                    select
                    SelectProps={{ native: true }}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} style={{ marginTop: '24px' }}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Ajouter le produit
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ 
                          backgroundColor: '#d32f2f',
                          '&:hover': {
                            backgroundColor: '#b71c1c',
                          }
                        }}
                        onClick={() => navigate(`/products`)}
                      >
                        Annuler
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Paper>
          </Box>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default ProduitAdd;
