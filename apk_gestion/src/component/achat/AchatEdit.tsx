import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Paper, TextField, Typography, Button, Grid, MenuItem, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import DeleteIcon from '@mui/icons-material/Delete';

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

function AchatEdit() {
  const [formData, setFormData] = useState({
    fournisseur_id: '',
    date_achat: '',
    produits: [{ produit_id: '', quantite: '', prix_unitaire: '', total: 0 }],
  });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); // ID de l'achat à éditer

  useEffect(() => {
    // Récupérer les fournisseurs
    axios.get('http://localhost:3001/gestionDB/fournisseur/')
      .then(response => setFournisseurs(response.data))
      .catch(error => console.error('Erreur lors de la récupération des fournisseurs :', error));

    // Récupérer les produits
    axios.get('http://localhost:3001/gestionDB/produit/')
      .then(response => setProduits(response.data))
      .catch(error => console.error('Erreur lors de la récupération des produits :', error));

    // Récupérer les détails de l'achat pour pré-remplir le formulaire
    axios.get(`http://localhost:3001/gestionDB/achat/${id}`)
      .then(response => {
        const achat = response.data;
        setFormData({
          fournisseur_id: achat.fournisseur_id._id,
          date_achat: new Date(achat.date_achat).toISOString().split('T')[0],
          produits: achat.produits.map(p => ({
            produit_id: p.produit_id._id,
            quantite: p.quantite,
            prix_unitaire: p.prix_unitaire,
            total: p.total,
          })),
        });
      })
      .catch(error => console.error('Erreur lors de la récupération de l\'achat :', error));
  }, [id]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        produits: formData.produits.map(p => ({
          ...p,
          prix_unitaire: parseFloat(p.prix_unitaire),
          quantite: parseInt(p.quantite, 10),
          total: parseFloat(p.prix_unitaire) * parseInt(p.quantite, 10),
        })),
        date_achat: new Date(formData.date_achat).toISOString(),
      };
      const response = await axios.put(`http://localhost:3001/gestionDB/achat/${id}`, data);
      console.log('Achat mis à jour avec succès:', response.data);
      alert('Achat mis à jour avec succès');
      navigate('/achats', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'achat :', error);
    }
  };

  const handleFournisseurChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProduitChange = (e, index: number) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    
    setFormData(prevState => {
      const produits = [...prevState.produits];
      produits[index] = {
        ...produits[index],
        [name]: isNaN(numericValue) ? '0' : value,
        total: name === 'quantite'
          ? (isNaN(numericValue) ? 0 : numericValue) * parseFloat(produits[index].prix_unitaire || '0')
          : produits[index].total,
      };
      return {
        ...prevState,
        produits,
      };
    });
  };

  const handleProduitSelectChange = (e, index: number) => {
    const produitId = e.target.value as string;
    const selectedProduit = produits.find(p => p._id === produitId);
    
    if (selectedProduit) {
      setFormData(prevState => {
        const produits = [...prevState.produits];
        produits[index] = {
          ...produits[index],
          produit_id: produitId,
          prix_unitaire: selectedProduit.prix_achat,
          total: parseFloat(selectedProduit.prix_achat) * parseInt(produits[index].quantite || '0', 10),
        };
        return {
          ...prevState,
          produits,
        };
      });
    }
  };

  const addProduct = () => {
    setFormData(prevState => ({
      ...prevState,
      produits: [...prevState.produits, { produit_id: '', quantite: '', prix_unitaire: '', total: 0 }],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData(prevState => {
      const produits = prevState.produits.filter((_, i) => i !== index);
      return {
        ...prevState,
        produits,
      };
    });
  };

  // Fonction pour calculer le total général
  const getTotalGeneral = () => {
    return formData.produits.reduce((acc, produit) => acc + produit.total, 0).toFixed(2);
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
              Modifier l'achat
            </Typography>
            <form onSubmit={handleSubmit}>
              <fieldset style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
                <legend style={{ fontWeight: 'bold' }}>Fournisseur</legend>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Fournisseur"
                      name="fournisseur_id"
                      value={formData.fournisseur_id}
                      onChange={handleFournisseurChange}
                      fullWidth
                      required
                    >
                      {fournisseurs.map(f => (
                        <MenuItem key={f._id} value={f._id}>{f.nom}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </fieldset>

              {formData.produits.map((produit, index) => (
                <fieldset key={index} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
                  <legend style={{ fontWeight: 'bold' }}>Produit {index + 1}</legend>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        select
                        label="Produit"
                        name="produit_id"
                        value={produit.produit_id}
                        onChange={e => handleProduitSelectChange(e, index)}
                        fullWidth
                        required
                        data-index={index}
                      >
                        {produits.map(p => (
                          <MenuItem key={p._id} value={p._id}>{p.label}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        type="number"
                        name="quantite"
                        value={produit.quantite || ''}
                        onChange={e => handleProduitChange(e, index)}
                        label="Quantité"
                        fullWidth
                        required
                        data-index={index}
                        inputProps={{
                          min: 1, // Valeur minimale autorisée
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        type="number"
                        name="prix_unitaire"
                        value={produit.prix_unitaire}
                        onChange={e => handleProduitChange(e, index)}
                        label="Prix unitaire"
                        fullWidth
                        required
                        data-index={index}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        type="number"
                        name="total"
                        value={produit.total}
                        label="Total"
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <IconButton onClick={() => removeProduct(index)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </fieldset>
              ))}
              <Button variant="contained" color="secondary" onClick={addProduct}>
                Ajouter un produit
              </Button>

              <fieldset style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '16px', marginTop: '16px' }}>
                <legend style={{ fontWeight: 'bold' }}>Informations de l'achat</legend>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="date"
                      id="date_achat"
                      name="date_achat"
                      value={formData.date_achat}
                      onChange={handleFournisseurChange}
                      label="Date de l'achat"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                </Grid>
              </fieldset>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Total Général: {getTotalGeneral()} €
                </Typography>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Mettre à jour l'achat
                </Button>
                <Button onClick={() => navigate(`/achats`)} variant="contained" fullWidth  sx={{ mt: 3, mb: 2, backgroundColor: '#d32f2f',  // Code hexadécimal pour un rouge foncé
                    '&:hover': {
                      backgroundColor: '#b71c1c',  // Couleur du bouton lors du survol
                    }}}>
                 Annuler
                </Button>
              </Grid>
            </form>
          </Paper>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default AchatEdit;
