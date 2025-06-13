import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, DialogContent, TextField, Dialog, DialogTitle, DialogContentText, DialogActions, Button } from '@mui/material';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
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

function Achats() {
  const [achats, setAchats] = useState<any[]>([]);
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  

  useEffect(() => {
    axios.get('http://localhost:3001/gestionDB/achat/')
      .then(response => {
        if (response.data) {
          setAchats(response.data);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des achats :', error));
  }, []);

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
  
    try {
      const achatToUpdate = achats.find(achat => achat._id === selectedProduct.achatId);
      if (!achatToUpdate) {
        console.error('achat introuvable');
        return;
      }
  
      const updatedProducts = achatToUpdate.produits.map(produit =>
        produit._id === selectedProduct._id
          ? { ...produit, quantite: selectedProduct.quantite, total: parseFloat(selectedProduct.prix_unitaire) * selectedProduct.quantite }
          : produit
      );
  
      const response = await axios.put(`http://localhost:3001/gestionDB/achat/${selectedProduct.achatId}`, {
        produits: updatedProducts,
        statut: achatToUpdate.statut // Assurez-vous que le statut est inclus si nécessaire
      });
  
      if (response.status === 200) {
        setAchats(achats.map(achat => 
          achat._id === selectedProduct.achatId ? { ...achat, produits: updatedProducts } : achat
        ));
        setOpenEditDialog(false);
        setSelectedProduct(null);
      } else {
        console.error('Erreur lors de la mise à jour de l\'achat :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du produit :', error);
    }
  };
  
  const openEditDialogWithProduct = (achatId: string, produit: any) => {
    setSelectedProduct({ ...produit, achatId });
    setOpenEditDialog(true);
  };


  const handleConfirm = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:3001/gestionDB/achat/${id}`, { statut: 'Confirmé' });
      if (response.status === 200) {
        setAchats(achats.map(achat => 
          achat._id === id ? { ...achat, statut: 'Confirmé' } : achat
        ));
      } else {
        console.error('Erreur lors de la confirmation de l\'achat :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation de l\'achat :', error);
    }
  };
  
  const handleDeleteProduct = async (achatId: string, produitId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit de l\'achat ?')) {
      try {
        const achatToUpdate = achats.find(achat => achat._id === achatId);
        if (!achatToUpdate) {
          console.error('Achat introuvable');
          return;
        }
  
        // Filtrer les produits pour enlever celui à supprimer
        const produitsRestants = achatToUpdate.produits.filter((produit: { _id: string; }) => produit._id !== produitId);
  
        // Mettre à jour l'achat avec les produits restants
        const response = await axios.put(`http://localhost:3001/gestionDB/achat/${achatId}`, {
          produits: produitsRestants
        });
  
        if (response.status === 200) {
          // Mettre à jour l'état local des achats
          setAchats(achats.map(achat => 
            achat._id === achatId ? { ...achat, produits: produitsRestants } : achat
          ));
        } else {
          console.error('Erreur lors de la mise à jour de l\'achat :', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error);
      }
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
            Liste des Achats
          </Typography>

          <br /><br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'blue' }}>
                <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} >Num Achat</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} >Fournisseur</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} >Date d'Achat</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} >Produit</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} >Quantité</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Prix Unitaire&nbsp;(€)</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Total&nbsp;(€)</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Remise&nbsp;(%)</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Taxes&nbsp;(%)</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Total HT&nbsp;(€)</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Total TTC&nbsp;(€)</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} >Statut</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}} >Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {achats.map(achat => (
                  achat.produits.map((produit, index) => (
                    <TableRow key={`${achat._id}-${index}`}  sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      borderBottom: '3px solid #e0e0e0', backgroundColor:  'white',
                      '&:hover': { backgroundColor: '#e0f7fa' },
                    }} >
                       {index === 0 && (
                        <TableCell rowSpan={achat.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                          {achat.num_achat || 'Non spécifié'} 
                        </TableCell>
                      )}
                      {index === 0 && (
                        <TableCell rowSpan={achat.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                          {/* Assurez-vous de formater et afficher les données de fournisseur correctement */}
                          {achat.fournisseur_id?.nom || 'Non spécifié'} {/* Remplacez avec le bon champ du fournisseur */}
                        </TableCell>
                      )}
                      {index === 0 && (
                        <TableCell rowSpan={achat.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                          {new Date(achat.date_achat).toLocaleDateString()}
                        </TableCell>
                      )}
                      <TableCell>{produit.produit_id?.label || 'Non spécifié'}</TableCell> {/* Assurez-vous de formater et afficher les données de produit correctement */}
                      <TableCell>{produit.quantite}</TableCell>
                      <TableCell>{produit.prix_unitaire.toFixed(2)}</TableCell>
                      <TableCell sx={{ borderRight: '3px solid #f9f9f9' }}>{produit.total.toFixed(2)}</TableCell>
                      
                    {index === 0 && ( <TableCell rowSpan={achat.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{achat.remise} </TableCell>)}
                    {index === 0 && ( <TableCell rowSpan={achat.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{achat.taxes} </TableCell>)}
                    {index === 0 && ( <TableCell rowSpan={achat.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{achat.total_ht} </TableCell>)}
                    {index === 0 && (
                    <TableCell rowSpan={achat.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{achat.total_ttc} </TableCell> )}
                      {index === 0 && (
                        <TableCell rowSpan={achat.produits.length} sx={{ borderRight: '3px solid #f9f9f9' ,fontWeight: 'bold',color: achat.statut === 'confirmé' ? 'green' : achat.statut === 'Commandé' ? 'blue' : 'inherit'}}>
                          {achat.statut}
                        </TableCell>
                      )}
                      <TableCell >
                        <IconButton onClick={() => openEditDialogWithProduct(achat._id, produit)} aria-label="edit" disabled={achat.statut === 'Confirmé'} style={{ display: 'none' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteProduct(achat._id, produit._id)} aria-label="delete" disabled={achat.statut === 'Confirmé'} >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => handleConfirm(achat._id)} aria-label="confirm" disabled={achat.statut === 'Confirmé'}>
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

export default Achats;
