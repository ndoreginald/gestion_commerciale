import { ThemeProvider } from '@emotion/react'
import { Box, Button, createTheme, CssBaseline, Grid, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

function FournisseurAdd() {

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    adresse: '',
    telephone: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Data being sent:', formData);  // Vérifiez ici les données
    try {
        const response = await axios.post('http://localhost:3001/gestionDB/fournisseur/', formData);
        setFormData({
            nom: '',
            email: '',
            adresse: '',
            telephone: '',
        });
        console.log('Fournisseur inscrit avec succès:', response.data);
        alert('Fournisseur inscrit avec succès');
        navigate('/fournisseurs' , { replace: true });    
    } catch (error) {
        console.error('There was an error registering the fournisseur!', error);
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
    <>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px', position: 'relative', height: '100vh' }}>
        <Header />
        <br /><br />
        <Box
          sx={{
            backgroundImage: `url('/img/users.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        <Paper style={{ padding: '16px', maxWidth: '600px', margin: 'auto' , backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
        <Typography variant="h4" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0', textDecoration: 'underline' }}>
          Add Fournisseur Form</Typography>
          <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
                {/* Ligne 1 : Nom et Téléphone */}
                <Grid item xs={12} sm={6}>
            <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="nom"
                        label="Name"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                 <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="telephone"
                        label="phone Number"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        inputProps={{
                          inputMode: 'numeric', // Affiche un pavé numérique sur mobile
                          pattern: '[0-9]*' // Accepte uniquement les chiffres
                        }}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                     <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="adresse"
                        label="Adresse"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                    />
                    </Grid>
                   
                   <Grid item xs={12} sm={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button></Grid>
            <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                }}}
              onClick={() => navigate(`/fournisseurs`)}
            >
              Cancel
            </Button>
            </Grid>
            </Grid>
          </form>
        </Paper>
        </Box>
        </main>
      </div>
      </ThemeProvider>
    </>
  )
}

export default FournisseurAdd;
