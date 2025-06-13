import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
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

function Fournisseurs() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/gestionDB/fournisseur/');
        setFournisseurs(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des fournisseurs :', error);
      }
    };

    fetchFournisseurs();
  }, []);

  const handleDelete = async (id: string, nom: string) => {
    if (confirm(`Voulez-vous vraiment supprimer ce fournisseur "${nom}"?`)) {
      try {
        const response = await axios.delete(`http://localhost:3001/gestionDB/fournisseur/${id}`);
        if (response.status === 200) {
          setFournisseurs(fournisseurs.filter(fournisseur => fournisseur._id !== id));
          alert('Fournisseur supprimé avec succès');
        } else {
          console.error("Erreur lors de la suppression du fournisseur :", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du fournisseur :", error);
      }
    }
  };

  const handleBlock = async (id: string, nom: string) => {
    try {
      const fournisseur = fournisseurs.find((c: any) => c._id === id);
      if (!fournisseur) {
        console.error("Fournisseur introuvable");
        return;
      }

      const nouveauStatut = fournisseur.statut === 'Actif' ? 'Bloqué' : 'Actif';

      const response = await fetch(`http://localhost:3001/gestionDB/fournisseur/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      });

      if (response.ok) {
        setFournisseurs(fournisseurs.map((c: any) => 
          c._id === id ? { ...c, statut: nouveauStatut } : c
        ));
      } else {
        console.error("Erreur lors du changement de statut :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
    }
  };

  const filteredFournisseurs = fournisseurs.filter((fournisseur: any) =>
    fournisseur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fournisseur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fournisseur.telephone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fournisseur.adresse.toLowerCase().includes(searchTerm.toLowerCase())
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
            Liste des Fournisseurs
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
        <TableCell sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }} align="right">Email</TableCell>
        <TableCell sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }} align="right">Téléphone</TableCell>
        <TableCell sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }} align="right">Adresse</TableCell>
        <TableCell sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }} align="right">Statut</TableCell>
        <TableCell sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }} align="right">Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredFournisseurs.map((fournisseur: any, index: number) => (
        <TableRow
          key={fournisseur._id}
          sx={{
            '&:last-child td, &:last-child th': { border: 0 },
            backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
            '&:hover': { backgroundColor: '#e0e0e0' },
          }}
        >
          <TableCell component="th" scope="row">
            {fournisseur.nom}
          </TableCell>
          <TableCell align="right">{fournisseur.email}</TableCell>
          <TableCell align="right">{fournisseur.telephone}</TableCell>
          <TableCell align="right">{fournisseur.adresse}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' ,color: fournisseur.statut === 'Actif' ? 'green' : fournisseur.statut === 'Bloqué' ? 'red' : 'inherit', fontWeight: 'bold'}}>{fournisseur.statut}</TableCell>
          <TableCell align="right">
            <IconButton
              onClick={() => navigate(`/fournisseurs/Edit/${fournisseur._id}`)}
              aria-label="edit"
              disabled={fournisseur.statut === 'Bloqué'}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleBlock(fournisseur._id, fournisseur.nom)} aria-label="block">
              {fournisseur.statut === 'Actif' ? <BlockIcon /> : <LockOpenIcon />}
            </IconButton>
            <IconButton onClick={() => handleDelete(fournisseur._id, fournisseur.nom)} aria-label="delete" style={{ display: 'none' }}>
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

export default Fournisseurs
