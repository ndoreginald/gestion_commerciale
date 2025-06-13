import { ThemeProvider, createTheme, CssBaseline, Grid, IconButton, Paper, TextField, Typography, Button, Box } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';


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

function CategorieAdd() {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    produits: [{
      //produit_id: null,
      label: '',
      description: '',
      prix_achat: '',
      prix_vente: '',
      image: '',
      code_barre: uuidv4(),
      date_creation:  new Date().toISOString().split('T')[0], // Date du jour formatée en AAAA-MM-JJ
    }] ,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Data being sent:', formData);  
    try {
      const response = await axios.post(`http://localhost:3001/gestionDB/categorie/`, formData);
      // Reset the form data and show success message
      setFormData({
        nom: '',
        description: '',
        produits: [],
      });
      console.log('Catégorie ajoutée avec succès:', response.data);
      alert('Catégorie ajoutée avec succès');
      navigate('/categories', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server responded with:', error.response.data);
          alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };
  

  const handleChange = (e, index?: number) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedProduits = [...formData.produits];
      updatedProduits[index] = {
        ...updatedProduits[index],
        [name]: value,
      };
      setFormData({ ...formData, produits: updatedProduits });
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddProduct = () => {
    setFormData(prevState => ({
      ...prevState,
      produits: [...prevState.produits, { label: '', description: '',prix_achat: '', prix_vente: '', image: '', code_barre: uuidv4(), date_creation:  new Date().toISOString().split('T')[0], // Date du jour formatée en AAAA-MM-JJ
      }],
    }));
  };

  const handleRemoveProduct = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      produits: prevState.produits.filter((_, i) => i !== index),
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px', position: 'relative', height: '100vh' }}>
          <Header />
          <br /><br />

          <Box
          sx={{
            backgroundImage: `url('/img/produit.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
         
          <Paper style={{ padding: '16px', maxWidth: '800px', margin: 'auto' , backgroundColor: 'rgba(255, 255, 255, 0.8)', width: '100%',}}>
          <Typography variant="h4" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0', textDecoration: 'underline' }}>
              Saisir les informations de la nouvelle catégorie
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    type="text" 
                    id="nom" 
                    name="nom" 
                    value={formData.nom} 
                    onChange={handleChange}
                    label="Category Name"
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
                    fullWidth
                    required 
                    label="Description"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Produits
                  </Typography>
                  <div>
                        <span className='text-danger'>
                        
                        =================================================================================
                        --------------------------------------------------------------------------------------------------------------------------------------------
                        =================================================================================
                        </span>
                      </div>
                  {formData.produits.map((produit, index) => (
                    <div className="container mt-3 pt-2" key={index}>
                      
                      <br />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            type="text" 
                            name="label" 
                            value={produit.label} 
                            onChange={(e) => handleChange(e, index)}
                            label="Label du produit"
                            fullWidth
                            required 
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            type="text" 
                            name="description" 
                            value={produit.description} 
                            onChange={(e) => handleChange(e, index)}
                            label="Description du produit"
                            fullWidth
                            required 
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                          type="number"
                          name="prix_achat"
                          value={produit.prix_achat}
                          onChange={(e) => handleChange(e, index)}
                          label="Prix Achat"
                          fullWidth
                          required
                          inputProps={{
                            min: 1, // Valeur minimale autorisée
                          }} 
                        />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            type="number" 
                            name="prix_vente" 
                            value={produit.prix_vente} 
                            onChange={(e) => handleChange(e, index)}
                            label="Prix Vente"
                            fullWidth
                            required
                            inputProps={{
                              min: 1, // Valeur minimale autorisée
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                        <TextField
                          type="text"
                          id="code_barre"
                          name="code_barre"
                          value={produit.code_barre} 
                          onChange={handleChange}
                          label="Code barre"
                          fullWidth
                          required
                          InputProps={{ readOnly: true }}  
                        />
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            type="date" 
                            name="date_creation" 
                            value={produit.date_creation} 
                            onChange={(e) => handleChange(e, index)}
                            label="Date de création"
                            fullWidth
                            InputProps={{readOnly: true,}}
                            required 
                          />
                        </Grid>
                        <Grid item xs={6} sm={9}>
                          <TextField
                            type="text" 
                            name="image" 
                            value={produit.image} 
                            onChange={(e) => handleChange(e, index)}
                            label="Image Url"
                            fullWidth
                            required 
                          />
                        </Grid>
                        <Grid item xs={12} sm={3} className="d-flex align-items-center">
                          <IconButton onClick={() => handleRemoveProduct(index)} aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid><br /><br /><br />
                    </div>
                  ))}
                  <br />
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Valider
                      </Button>
                     </Grid>
                     <Grid item xs={4}>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        fullWidth 
                        onClick={handleAddProduct} 
                        startIcon={<AddIcon />} >
                        Ajouter un produit
                      </Button>
                     </Grid>
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        variant="contained" sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' }}}
                        onClick={() => navigate(`/categories`)} >
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

export default CategorieAdd;
