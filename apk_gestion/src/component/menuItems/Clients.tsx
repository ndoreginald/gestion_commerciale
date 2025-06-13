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

function Clients() {
  const [clients, setClient] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/gestionDB/client/')
      .then(response => response.json())
      .then(data => {
        if (data) {
          setClient(data);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des données :', error));
  }, []);

  const handleDelete = async (id, nom) => {
    if (confirm(`Voulez vous vraiment supprimer cet utilisateur "${nom}"?`)) {
      try {
        const response = await fetch(`http://localhost:3001/gestionDB/client/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          setClient(clients.filter(client => client._id !== id));
        } else {
          console.error("Erreur lors de la suppression de l'utilisateur :", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
      }
    }
  };

  const handleBlock = async (id, nom) => {
    try {
      const client = clients.find(c => c._id === id);
      if (!client) {
        console.error("Client introuvable");
        return;
      }

      const nouveauStatut = client.statut === 'Actif' ? 'Bloqué' : 'Actif';

      const response = await fetch(`http://localhost:3001/gestionDB/client/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      });

      if (response.ok) {
        setClient(clients.map(c => 
          c._id === id ? { ...c, statut: nouveauStatut } : c
        ));
      } else {
        console.error("Erreur lors du changement de statut :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
    }
  };

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            Liste des Clients
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
           {/* Champ de recherche */}
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
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Nom</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} align="right">Email</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} align="right">Téléphone</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} align="right">Adresse</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} align="right">Statut</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} align="right">Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredClients.map((client, index) => (
        <TableRow 
          key={client._id} 
          sx={{ 
            '&:last-child td, &:last-child th': { border: 0 },
            backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',  // Zebra stripes
            '&:hover': { backgroundColor: '#e0f7fa' }, // Hover effect
          }}
        >
          <TableCell component="th" scope="row" sx={{ padding: '10px' }}>{client.nom}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' }}>{client.email}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' }}>{client.telephone}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' }}>{client.adresse}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' ,color: client.statut === 'Actif' ? 'green' : client.statut === 'Bloqué' ? 'red' : 'inherit', fontWeight: 'bold'}}>{client.statut}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' }}>
            <IconButton onClick={() => navigate(`/clients/clientEdit/${client._id}`)} aria-label="edit" disabled={client.statut === 'Bloqué'}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleBlock(client._id, client.nom)} aria-label="block">
              {client.statut === 'Actif' ? <BlockIcon /> : <LockOpenIcon />}
            </IconButton>
            <IconButton onClick={() => handleDelete(client._id, client.nom)} aria-label="delete" style={{ display: 'none' }}>
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

export default Clients;
