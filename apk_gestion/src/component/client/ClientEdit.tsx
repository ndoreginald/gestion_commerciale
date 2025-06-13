import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import { Paper } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function ClientEdit () {


    const { id } = useParams();  // Capture the id from the URL
    const [client, setClient] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data based on id
        axios.put(`http://localhost:3001/gestionDB/client/${id}`)
            .then(response => setClient(response.data))
            .catch(error => console.error('Error fetching user data:', error));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const updatedFormData = {
            ...client,
          };
          await fetch(`http://localhost:3001/gestionDB/client/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFormData),
          })
            .then(response => response.json())
            .catch(error => console.error('Error updating data:', error));
            navigate(`/clients` , { replace: true });
        } catch (error) {
          console.error('Erreur lors de la mise à jour des données :', error);
        }
      };

    if (!client) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px' }}>
        <Header />
       <br /><br />
       
       <Paper style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
            <Typography component="h1" variant="h5">Edit Client Form</Typography>
            <form  onSubmit={handleSubmit} >
           
            <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="nom"
                        label="Name"
                        name="nom"
                        value={client.nom || ''}
                        onChange={(e) => setClient({ ...client, nom: e.target.value })}
                    />
                 <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="telephone"
                        label="phone Number"
                        name="telephone"
                        value={client.telephone || ''}
                        onChange={(e) => setClient({ ...client, telephone: e.target.value })}
                        inputProps={{
                          inputMode: 'numeric', // Affiche un pavé numérique sur mobile
                          pattern: '[0-9]*' // Accepte uniquement les chiffres
                        }}
                    />
                     <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={client.email || ''}
                        onChange={(e) => setClient({ ...client, email: e.target.value })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="adresse"
                        label="Adresse"
                        name="adresse"
                        value={client.adresse || ''}
                        onChange={(e) => setClient({ ...client, adresse: e.target.value })}
                    />
                    <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >submit</Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 , backgroundColor: '#d32f2f',  // Code hexadécimal pour un rouge foncé
                                '&:hover': {
                                    backgroundColor: '#b71c1c',  // Couleur du bouton lors du survol
                                 }}}
                                 onClick={() => navigate(`/clients`)}
                        >cancel</Button>
                    
                </form>
            </Paper>
        </main>
      </div>
    </ThemeProvider>
        </>
       
    );
};


export default ClientEdit
