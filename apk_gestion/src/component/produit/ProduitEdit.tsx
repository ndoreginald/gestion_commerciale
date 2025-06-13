import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Paper, TextField, Typography, Button, Grid, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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

function ProduitEdit() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    prix_vente: '',
    prix_achat: '0',
    image: '',
    code_barre: '',
    date_creation: '',
    statut: 'actif',
    categorie_id: '',
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the product details
    axios.get(`http://localhost:3001/gestionDB/produit/${id}`)
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => console.error('Erreur lors de la récupération des données du produit :', error));

    // Fetch the categories for the select input
    fetch('http://localhost:3001/gestionDB/categorie/')
      .then(response => response.json())
      .then(data => {
        if (data) {
          setCategories(data);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
  }, [id]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const data = {
      ...formData,
      prix_vente: parseFloat(formData.prix_vente),
      prix_achat: parseFloat(formData.prix_achat),
      date_creation: new Date(formData.date_creation).toISOString(),
    };
    try {
      const response = await axios.put(`http://localhost:3001/gestionDB/produit/${id}`, data);
      console.log('Produit mis à jour avec succès:', response.data);
      alert('Produit mis à jour avec succès');
      navigate('/products', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit :', error);
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
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
        <main style={{ flexGrow: 1, padding: '10px' }}>
          <Header />
          <br /><br />
          <Paper style={{ padding: '16px', maxWidth: '800px', margin: 'auto' }}>
            <Typography variant="h6" gutterBottom color="primary" className="text-center">
              Modifier les informations du produit
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
                    value={formData.code_barre}
                    onChange={handleChange}
                    label="Code barre"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    id="date_creation"
                    name="date_creation"
                    value={formData.date_creation.split('T')[0]}  // Format date
                    onChange={handleChange}
                    label="Date de création"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
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
                      Mettre à jour le produit
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
        </main>
      </div>
    </ThemeProvider>
  );
}

export default ProduitEdit;
