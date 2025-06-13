import { ThemeProvider } from '@emotion/react'
import { Button, createTheme, CssBaseline, Paper, TextField, Typography, Box, Grid } from '@mui/material'
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
  
function UserAdd() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    telephone: '',
});

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Data being sent:', formData);  // Vérifiez ici les données
    try {
        const response = await axios.post('http://localhost:3001/gestionDB/utilisateur/', formData);
        setFormData({
            nom: '',
            email: '',
            password: '',
            telephone: '',
        });
        console.log('utilisateur inscrit avec succès:', response.data);
        alert('utilisateur inscrit avec succès');
        navigate('/users', { replace: true });    
    } catch (error) {
        console.error('There was an error registering the user!', error);
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
            <Paper style={{ padding: '16px', maxWidth: '600px', margin: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <Typography variant="h4" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0', textDecoration: 'underline' }}>
              Ajouter un nouvel Utilisateur
            </Typography>
            <form  onSubmit={handleSubmit} >
           
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
                    label="Phone Number"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    inputProps={{
                      inputMode: 'numeric', // Affiche un pavé numérique sur mobile
                      pattern: '[0-9]*' // Accepte uniquement les chiffres
                    }}
                  />
                </Grid>

                {/* Ligne 2 : Email et Mot de Passe */}
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
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
             
              <Grid item xs={12} sm={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >Submit</Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3, mb: 2, backgroundColor: '#d32f2f',  // Code hexadécimal pour un rouge foncé
                      '&:hover': {
                        backgroundColor: '#b71c1c',  // Couleur du bouton lors du survol
                      }
                    }}
                    onClick={() => navigate(`/users`)}
                  >Cancel</Button>
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

export default UserAdd
