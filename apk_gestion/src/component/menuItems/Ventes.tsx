import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Grid } from '@mui/material';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import axios from 'axios';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

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

function Ventes() {
  const [ventes, setVentes] = useState<any[]>([]);
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  

  useEffect(() => {
    axios.get('http://localhost:3001/gestionDB/vente/')
      .then(response => {
        if (response.data) {
            setVentes(response.data);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des ventes :', error));
  }, []);

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
  
    try {
      const venteToUpdate = ventes.find(vente => vente._id === selectedProduct.venteId);
      if (!venteToUpdate) {
        console.error('Vente introuvable');
        return;
      }
  
      const updatedProducts = venteToUpdate.produits.map(produit =>
        produit._id === selectedProduct._id
          ? { ...produit, quantite: selectedProduct.quantite, total: parseFloat(selectedProduct.prix_unitaire) * selectedProduct.quantite }
          : produit
      );
  
      const response = await axios.put(`http://localhost:3001/gestionDB/vente/${selectedProduct.venteId}`, {
        produits: updatedProducts,
        statut: venteToUpdate.statut // Assurez-vous que le statut est inclus si nécessaire
      });
  
      if (response.status === 200) {
        setVentes(ventes.map(vente => 
          vente._id === selectedProduct.venteId ? { ...vente, produits: updatedProducts } : vente
        ));
        setOpenEditDialog(false);
        setSelectedProduct(null);
      } else {
        console.error('Erreur lors de la mise à jour de la vente :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du produit :', error);
    }
  };
  
  const openEditDialogWithProduct = (venteId: string, produit: any) => {
    setSelectedProduct({ ...produit, venteId });
    setOpenEditDialog(true);
  };
  

 


  const handleDeleteProduct = async (venteId: string, produitId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit de la vente ?')) {
      try {
        const venteToUpdate = ventes.find(vente => vente._id === venteId);
        if (!venteToUpdate) {
          console.error('Vente introuvable');
          return;
        }
  
        // Filtrer les produits pour enlever celui à supprimer
        const produitsRestants = venteToUpdate.produits.filter((produit: { _id: string; }) => produit._id !== produitId);
  
        // Mettre à jour la vente avec les produits restants
        const response = await axios.put(`http://localhost:3001/gestionDB/vente/${venteId}`, {
          produits: produitsRestants
        });
  
        if (response.status === 200) {
          // Mettre à jour l'état local des ventes
          setVentes(ventes.map(vente => 
            vente._id === venteId ? { ...vente, produits: produitsRestants } : vente
          ));
        } else {
          console.error('Erreur lors de la mise à jour de la vente :', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error);
      }
    }
  };
  



  const handleConfirm = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:3001/gestionDB/vente/${id}`, { statut: 'Confirmé' });
      if (response.status === 200) {
        setVentes(ventes.map(vente => 
            vente._id === id ? { ...vente, statut: 'Confirmé' } : vente
        ));
      } else {
        console.error('Erreur lors de la confirmation de vente :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation de vente :', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px' }}>
          <Header />
          <br /><br />
          <Typography variant="h2" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0' }}>
            Liste des Ventes
          </Typography>
          <br /><br />
          <TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow sx={{ backgroundColor: 'blue' }}>
      <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} >Num Vente</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Clients</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Date de Vente</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Produit</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Quantité</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Prix Unitaire&nbsp;(€)</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Total&nbsp;(€)</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Remise&nbsp;(%)</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Taxes&nbsp;(%)</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Total HT&nbsp;(€)</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Total TTC&nbsp;(€)</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Statut</TableCell>
        <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {ventes.map(vente => (
        vente.produits.map((produit, index) => (
          <TableRow 
            key={`${vente._id}-${index}`} 
            sx={{ 
              '&:last-child td, &:last-child th': { border: 0 },
              borderBottom: '3px solid #e0e0e0', backgroundColor:  'white',
              '&:hover': { backgroundColor: '#e0f7fa' },
            }}
          >
            {index === 0 && (
                        <TableCell rowSpan={vente.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                          {vente.num_vente || 'Non spécifié'} 
                        </TableCell>
                      )}
            {index === 0 && (
              <>
                <TableCell rowSpan={vente.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                  {vente.client_id?.nom || 'Non spécifié'}
                </TableCell>
                <TableCell rowSpan={vente.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                  {new Date(vente.date_vente).toLocaleDateString()}
                </TableCell>
              </>
            )}
            <TableCell>{produit.produit_id?.label || 'Non spécifié'}</TableCell>
            <TableCell>{produit.quantite}</TableCell>
            <TableCell>{produit.prix_unitaire.toFixed(2)} €</TableCell>
            <TableCell sx={{ borderRight: '3px solid #f9f9f9' }}>{produit.total.toFixed(2)} €</TableCell>
            {index === 0 && ( <TableCell rowSpan={vente.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{vente.remise} </TableCell>)}
                    {index === 0 && ( <TableCell rowSpan={vente.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{vente.taxes} </TableCell>)}
                    {index === 0 && ( <TableCell rowSpan={vente.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{vente.total_ht} </TableCell>)}
                    {index === 0 && (
                    <TableCell rowSpan={vente.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{vente.total_ttc} </TableCell> )}
            {index === 0 && (
              <TableCell rowSpan={vente.produits.length} sx={{ borderRight: '3px solid #f9f9f9' ,fontWeight: 'bold',color: vente.statut === 'Confirmé' ? 'green' : vente.statut === 'Envoyer' ? 'blue' : 'inherit'}}>
                {vente.statut}
              </TableCell>
            )}
            <TableCell>
              <IconButton onClick={() => openEditDialogWithProduct(vente._id, produit)} aria-label="edit" disabled={vente.statut === 'Confirmé'} style={{ display: 'none' }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteProduct(vente._id, produit._id)} aria-label="delete" disabled={vente.statut === 'Confirmé'} >
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => handleConfirm(vente._id)} aria-label="confirm" disabled={vente.statut === 'Confirmé'}>
                <DoneOutlineIcon />
              </IconButton>
            </TableCell>
            
          </TableRow>
          
        ))
        
      ))}
      
    </TableBody>
  </Table>
</TableContainer>


          <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
            <DialogTitle>Modifier le Produit</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Modifiez les détails du produit sélectionné.
              </DialogContentText>
              <TextField
                margin="dense"
                label="Quantité"
                type="number"
                fullWidth
                variant="outlined"
                value={selectedProduct?.quantite || ''}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, quantite: parseFloat(e.target.value) })}
              />
              <TextField
                margin="dense"
                label="Prix Unitaire"
                type="number"
                fullWidth
                variant="outlined"
                value={selectedProduct?.prix_unitaire || ''}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, prix_unitaire: parseFloat(e.target.value) })}
                InputProps={{ readOnly: true }} // Prix unitaire ne doit pas être modifié
              />
              <TextField
                margin="dense"
                label="Total"
                type="number"
                fullWidth
                variant="outlined"
                value={(parseFloat(selectedProduct?.prix_unitaire || '0') * (selectedProduct?.quantite || 0)).toFixed(2)}
                InputProps={{ readOnly: true }} // Total est calculé automatiquement
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)} color="primary">
                Annuler
              </Button>
              <Button onClick={handleEditProduct} color="primary">
                Sauvegarder
              </Button>
            </DialogActions>
          </Dialog>
         
        </main>
      </div>
    </ThemeProvider>
  );
}


export default Ventes
