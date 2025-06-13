import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
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

interface Categorie {
  _id: string;
  nom: string;
  description?: string;
}

function Categories() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/gestionDB/categorie/')
      .then(response => response.json())
      .then(data => {
        if (data) {
          setCategories(data);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des données :', error));
  }, []);

  const handleDelete = async (id: string, nom: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer cette catégorie "${nom}"?`)) {
      try {
        const response = await fetch(`http://localhost:3001/gestionDB/categorie/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          setCategories(categories.filter(categorie => categorie._id !== id));
        } else {
          console.error("Erreur lors de la suppression de la catégorie :", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie :", error);
      }
    }
  };

  const filteredCategories = categories.filter(categorie =>
    categorie.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categorie.description && categorie.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px' }}>
          <Header />
          <br /><br />
          <Typography variant="h2" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0' }}>
            Liste des Categories
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
           <TextField
            label="Rechercher"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 500 }}
          />

          </div>


          <TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow sx={{ backgroundColor: 'blue' }}>
        <TableCell sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>Nom</TableCell>
        <TableCell sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }} align="left">Description</TableCell>
        <TableCell sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }} align="right">Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredCategories.map((categorie, index) => (
        <TableRow 
          key={categorie._id} 
          sx={{ 
            '&:last-child td, &:last-child th': { border: 0 },
            backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
            '&:hover': {
              backgroundColor: '#e0f7fa',  // Couleur de survol modifiée
            },
          }}
        >
          <TableCell component="th" scope="row" sx={{ padding: '10px' ,fontWeight: 'bold'}}>
            {categorie.nom}
          </TableCell>
          <TableCell align="left">{categorie.description || 'N/A'}</TableCell>
          <TableCell align="right">
            <IconButton 
              onClick={() => navigate(`/categories/Edit/${categorie._id}`)} 
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              onClick={() => handleDelete(categorie._id, categorie.nom)} 
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>



        </main>
      </div>
    </ThemeProvider>
  );
}

export default Categories;
