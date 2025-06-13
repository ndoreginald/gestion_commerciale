import { ThemeProvider } from '@emotion/react';
import { Button, createTheme, CssBaseline, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import { useNavigate, useParams } from 'react-router-dom';
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

function FournisseurEdit() {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        adresse: '',
        telephone: '',
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFournisseur = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/gestionDB/fournisseur/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching fournisseur:', error);
            }
        };
        fetchFournisseur();
    }, [id]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/gestionDB/fournisseur/${id}`, formData);
            alert('Fournisseur mis à jour avec succès');
            navigate('/fournisseurs', { replace: true });
        } catch (error) {
            console.error('Error updating fournisseur:', error);
        }
    };

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
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
                    <main style={{ flexGrow: 1, padding: '10px' }}>
                        <Header />
                        <br /><br />
                        <Paper style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
                            <Typography component="h1" variant="h5">Edit Fournisseur Form</Typography>
                            <form onSubmit={handleSubmit}>
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
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Submit
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        mt: 3, mb: 2, backgroundColor: '#d32f2f',
                                        '&:hover': {
                                            backgroundColor: '#b71c1c',
                                        }
                                    }}
                                    onClick={() => navigate(`/fournisseurs`)}
                                >
                                    Cancel
                                </Button>
                            </form>
                        </Paper>
                    </main>
                </div>
            </ThemeProvider>
        </>
    );
}

export default FournisseurEdit;
