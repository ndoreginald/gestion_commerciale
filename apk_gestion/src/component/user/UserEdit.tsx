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

function UserEdit () {

   

    const { id } = useParams();  // Capture the id from the URL
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data based on id
        axios.put(`http://localhost:3001/gestionDB/utilisateur/${id}`)
            .then(response => setUser(response.data))
            .catch(error => console.error('Error fetching user data:', error));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const updatedFormData = {
            ...user,
          };
          await fetch(`http://localhost:3001/gestionDB/utilisateur/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFormData),
          })
            .then(response => response.json())
            .catch(error => console.error('Error updating data:', error));
            navigate(`/users`, { replace: true });
        } catch (error) {
          console.error('Erreur lors de la mise à jour des données :', error);
        }
      };

    if (!user) {
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
            <Typography component="h1" variant="h5">Edit Form</Typography>
            <form  onSubmit={handleSubmit} >
           
            <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="nom"
                        label="Name"
                        name="nom"
                        value={user.nom || ''}
                        onChange={(e) => setUser({ ...user, nom: e.target.value })}
                    />
                 <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="telephone"
                        label="phone Number"
                        name="telephone"
                        value={user.telephone || ''}
                        onChange={(e) => setUser({ ...user, telephone: e.target.value })}
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
                        value={user.email || ''}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="Password"
                        name="password"
                        value={user.password || ''}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                     <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="role"
                        label="Role"
                        name="role"
                        value={user.role || ''}
                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                        select
                        SelectProps={{ native: true }}
                        >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </TextField>
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
                                 onClick={() => navigate(`/users`)}
                        >cancel</Button>
                    
                </form>
            </Paper>
        </main>
      </div>
    </ThemeProvider>
        </>
       
    );
};

export default UserEdit;
