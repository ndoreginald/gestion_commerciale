import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
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

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // État pour stocker la recherche
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/gestionDB/utilisateur/')
      .then(response => response.json())
      .then(data => {
        if (data) {
          setUsers(data);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des données :', error));
  }, []);

  const handleDelete = async (id, nom) => {
    if (confirm(`Voulez-vous vraiment supprimer cet utilisateur "${nom}"?`)) {
      try {
        const response = await fetch(`http://localhost:3001/gestionDB/utilisateur/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          setUsers(users.filter(user => user._id !== id));
        } else {
          console.error("Erreur lors de la suppression de l'utilisateur :", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
      }
    }
  };

  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.telephone.includes(searchQuery)
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
            Liste des Utilisateurs
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <TextField
              label="Rechercher"
              variant="outlined"
              margin="normal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 500 }}  // Largeur réduite
            />
          </div>

          <TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow sx={{ backgroundColor: 'blue' }}>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Nom</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} align="right">Rôle</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} align="right">Mot de passe</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} align="right">Email</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} align="right">Téléphone</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} align="right">Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredUsers.map((user, index) => (
        <TableRow 
          key={user._id} 
          sx={{ 
            '&:last-child td, &:last-child th': { border: 0 },
            backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',  // Zebra stripes
            '&:hover': { backgroundColor: '#e0f7fa' }, // Hover effect
          }}
        >
          <TableCell component="th" scope="row" sx={{ padding: '10px' }}>{user.nom}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' ,color: user.role === 'user' ? 'green' : user.role === 'admin' ? 'blue' : 'inherit', fontWeight: 'bold'}}>{user.role}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' }}>{user.password}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' }}>{user.email}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' }}>{user.telephone}</TableCell>
          <TableCell align="right" sx={{ padding: '10px' }}>
            <IconButton onClick={() => navigate(`/users/userEdit/${user._id}`)} aria-label="edit">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(user._id, user.nom)} aria-label="delete">
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

export default Users;
