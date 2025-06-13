import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

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

function SignUp() {
    const navigate = useNavigate();  // Hook pour la navigation
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
            console.log('Utilisateur inscrit avec succès:', response.data);
            alert('Utilisateur inscrit avec succès');
            navigate('/', { replace: true });    // Rediriger vers la page "signin"
        } catch (error) {
            console.error('There was an error registering the user!', error);
            alert('Il y a eu une erreur lors de l\'inscription. Veuillez réessayer.');
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
            <Box
                sx={{
                    position: 'relative',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: `url('img/image.avif')`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
                <Container
                    component="main"
                    maxWidth="xs"
                    sx={{
                        position: 'relative',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fond blanc semi-transparent pour le formulaire
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: 3, // Ajout d'une ombre pour faire ressortir le formulaire
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 70, height: 70 }}>
                            <LockOutlinedIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="nom"
                                label="Name"
                                name="nom"
                                autoComplete="name"
                                autoFocus
                                value={formData.nom}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="telephone"
                                label="Phone Number"
                                name="telephone"
                                autoComplete="tel"
                                value={formData.telephone}
                                onChange={handleChange}
                                inputProps={{
                                    inputMode: 'numeric', // Affiche un pavé numérique sur mobile
                                    pattern: '[0-9]*' // Accepte uniquement les chiffres
                                  }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/" variant="body2">
                                        {"Have already an account? Sign In"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default SignUp;
