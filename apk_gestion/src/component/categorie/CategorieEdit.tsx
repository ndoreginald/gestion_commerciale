import React, { useEffect, useState } from 'react';
import { Button, CssBaseline, TextField, Typography, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';

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

function CategorieEdit() {
  const { id } = useParams(); // Capture the id from the URL
  const [categorie, setCategorie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch category data based on id
    axios.get(`http://localhost:3001/gestionDB/categorie/${id}`)
      .then(response => setCategorie(response.data))
      .catch(error => console.error('Error fetching category data:', error));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...categorie,
      };
      await axios.put(`http://localhost:3001/gestionDB/categorie/${id}`, updatedFormData)
        .then(response => response.data)
        .catch(error => console.error('Error updating data:', error));
      navigate(`/categories`, { replace: true });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données :', error);
    }
  };

  if (!categorie) {
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
              <Typography component="h1" variant="h5">Edit Category Form</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="nom"
                  label="Category Name"
                  name="nom"
                  value={categorie.nom || ''}
                  onChange={(e) => setCategorie({ ...categorie, nom: e.target.value })}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  value={categorie.description || ''}
                  onChange={(e) => setCategorie({ ...categorie, description: e.target.value })}
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
                  sx={{ mt: 3, mb: 2, backgroundColor: '#d32f2f',  // Code hexadécimal pour un rouge foncé
                    '&:hover': {
                      backgroundColor: '#b71c1c',  // Couleur du bouton lors du survol
                    }}}
                  onClick={() => navigate(`/categories`)}
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

export default CategorieEdit;
