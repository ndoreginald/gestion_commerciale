import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
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

function Products() {
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/gestionDB/produit/')
      .then(response => response.json())
      .then(data => {
        if (data) {
          setProduits(data);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des données :', error));
  }, []);

  const handleBlock = async (id, label) => {
    try {
      const produit = produits.find(p => p._id === id);
      if (!produit) {
        console.error("Produit introuvable");
        return;
      }

      const nouveauStatut = produit.statut === 'actif' ? 'inactif' : 'actif';

      const response = await fetch(`http://localhost:3001/gestionDB/produit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      });

      if (response.ok) {
        setProduits(produits.map(p => 
          p._id === id ? { ...p, statut: nouveauStatut } : p
        ));
      } else {
        console.error("Erreur lors du changement de statut :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
    }
  };

 // Filtrer les produits en fonction de la recherche
const produitsFiltres = produits.filter(produit => 
  produit.label.toLowerCase().includes(searchTerm.toLowerCase())
);

// Regrouper les produits filtrés par catégorie
const produitsParCategorie = produitsFiltres.reduce((acc, produit) => {
  const categorie = produit.categorie_id && produit.categorie_id.nom ? produit.categorie_id.nom : 'Autres';
  if (!acc[categorie]) {
    acc[categorie] = [];
  }
  acc[categorie].push(produit);
  return acc;
}, {});

// Trier les catégories par ordre alphabétique
const categoriesTriees = Object.keys(produitsParCategorie).sort();

  



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px' }}>
          <Header />
          <br /><br />
          <Typography variant="h2" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0' }}>
            Liste des Produits
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <TextField
              label="Rechercher un produit"
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
        <TableCell sx={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }}>Image</TableCell>
        <TableCell sx={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }}>Label</TableCell>
        <TableCell sx={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }} align="right">Description</TableCell>
        <TableCell sx={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }} align="right">Prix Vente&nbsp;(€)</TableCell>
        <TableCell sx={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }} align="right">Prix Achat&nbsp;(€)</TableCell>
        <TableCell sx={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }} align="right">Code Barre&nbsp;</TableCell>
        <TableCell sx={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }} align="right">Date Création&nbsp;</TableCell>
        <TableCell sx={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }} align="right">Statut&nbsp;</TableCell>
        <TableCell sx={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }} align="right">Catégorie&nbsp;</TableCell>
        <TableCell sx={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }} align="right">Action&nbsp;</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {categoriesTriees.map(categorie => (
        <React.Fragment key={categorie}>
          <TableRow sx={{ backgroundColor: 'lightgray' }}>
            <TableCell colSpan={10} sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {categorie}
            </TableCell>
          </TableRow>
          {produitsParCategorie[categorie]
            .sort((a, b) => a.label.localeCompare(b.label))
            .map(produit => (
              <TableRow 
                key={produit._id} 
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: '#e0f7fa'  // Couleur de survol modifiée
                  }
                }}
              >
                <TableCell component="th" scope="row" style={{ width: '120px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90px' }}>
                    <img src={produit.image} alt={produit.label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                </TableCell>
                <TableCell align="right">{produit.label}</TableCell>
                <TableCell align="right">{produit.description || 'N/A'}</TableCell>
                <TableCell align="right">{produit.prix_vente.toFixed(2)}</TableCell>
                <TableCell align="right">{produit.prix_achat.toFixed(2)}</TableCell>
                <TableCell align="right">{produit.code_barre}</TableCell>
                <TableCell align="right">{new Date(produit.date_creation).toLocaleDateString()}</TableCell>
                <TableCell align="right" sx={{ padding: '10px' ,color: produit.statut === 'actif' ? 'green' : produit.statut === 'inactif' ? 'red' : 'inherit', fontWeight: 'bold'}}>{produit.statut}</TableCell>
                <TableCell align="right">{produit.categorie_id ? produit.categorie_id.nom : 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => navigate(`/products/Edit/${produit._id}`)} 
                    aria-label="edit" 
                    disabled={produit.statut === 'inactif'}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleBlock(produit._id, produit.label)} 
                    aria-label="block"
                  >
                    {produit.statut === 'actif' ? <BlockIcon /> : <LockOpenIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </React.Fragment>
      ))}
    </TableBody>
  </Table>
</TableContainer>


        </main>
      </div>
    </ThemeProvider>
  );
}

export default Products;
