import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import axios from 'axios';
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

function StockIn() {
    const [stocks, setStock] = useState<any[]>([]);

    useEffect(() => {
        axios.get('http://localhost:3001/gestionDB/stock/in')
            .then(response => {
                console.log(response.data);
                if (response.data) {
                    // Filtrer les produits qui ont une quantité d'entrée > 0
                    const filteredStocks = response.data.map(stock => ({
                        ...stock,
                        produits: stock.produits.filter(produit => produit.quantite_entree > 0)
                    })).filter(stock => stock.produits.length > 0);
    
                    setStock(filteredStocks);
                }
            })
            .catch(error => console.error('Erreur lors de la récupération des stocks :', error));
    }, []);
    

    if (stocks.length === 0) {
        return <Typography>Chargement...</Typography>;
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
                        <Paper>
                            <Typography variant="h3" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0' }}>
                                Mouvements de Stock et Quantité Actuelle (Entrée)
                            </Typography><br />
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'blue' }}>
                                        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Date d'Entrée</TableCell>
                                        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Produit</TableCell>
                                        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Quantité Entrée</TableCell>
                                        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Quantité Totale en Stock</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stocks.map((stock) => (
                                        stock.produits.map((produit, index) => (
                                            <TableRow key={`${stock._id}-${index}`} sx={{ 
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                borderBottom: '3px solid #e0e0e0', backgroundColor:  'white',
                                                '&:hover': { backgroundColor: '#e0f7fa' },
                                              }}>
                                                {index === 0 && (
                                                    <TableCell rowSpan={stock.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                                                        {new Date(stock.date_entree).toLocaleDateString()}
                                                    </TableCell>
                                                )}
                                                <TableCell>{produit.produit_id?.label || 'Non spécifié'}</TableCell> 
                                                <TableCell>{produit.quantite_entree}</TableCell>
                                                <TableCell sx={{ ontSize: '1.2rem', fontWeight: 'bold', color: produit.quantite_actuelle < 10 ? 'red' : 'black',  
                                                    backgroundColor: produit.quantite_actuelle < 10 ? 'rgba(255,0,0,0.1)'
                                                     : produit.quantite_actuelle > 20 ? 'rgba(0,255,0,0.1)' : 'transparent'  }}>{produit.quantite_actuelle}</TableCell>
                                            </TableRow>
                                        ))
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </main>
                </div>
            </ThemeProvider>
        </>
    );
};

export default StockIn;
