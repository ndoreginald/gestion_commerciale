import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import axios from "axios";

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

function StockList() {
  const [products, setProducts] = useState([]); // État pour stocker les produits
  const [searchTerm, setSearchTerm] = useState('');

  // Appel de l'API pour récupérer les quantités actuelles des produits
  useEffect(() => {
    const fetchProductQuantities = async () => {
      try {
        const response = await axios.get("http://localhost:3001/gestionDB/stock/produits/quantite-actuelle");
        setProducts(response.data); // Met à jour l'état avec les données reçues
      } catch (error) {
        console.error("Erreur lors de la récupération des quantités de produits :", error);
      }
    };

    fetchProductQuantities(); // Appelle la fonction pour récupérer les données à l'affichage du composant
  }, []); // L'effet se déclenche uniquement lors du premier rendu du composant

  // Filtrage des produits en fonction du terme de recherche
  const filteredProduit = products.filter(product =>
    product.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App" style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ flexGrow: 1, padding: '10px' }}>
            <Header />
            <br /><br />
            <Typography variant="h2" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0' }}>
              Quantité En Stock Pour Chaque Produit
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
        <TableCell sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>Produit</TableCell>
        <TableCell sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>Quantité Actuelle</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {/* Utiliser le tableau filtré (filteredProduit) au lieu de products */}
      {filteredProduit.map((product: any, index: number) => ( // Add index here
        <TableRow key={product._id} sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',  // Zebra stripes
          '&:hover': { backgroundColor: '#e0f7fa' }, // Hover effect
        }}>
          <TableCell>{product.label}</TableCell> {/* Affiche le nom/label du produit */}
          <TableCell>{product.quantite_actuelle}</TableCell> {/* Affiche la quantité actuelle */}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

          </main>
        </div>
      </ThemeProvider>
    </>
  );
}

export default StockList;
