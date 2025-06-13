import { Button, createTheme, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled, ThemeProvider } from '@mui/material/styles';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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


function Devis() {

  const [devis, setDevis] = useState<any[]>([]);
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  

  useEffect(() => {
    // Récupérer les devis depuis l'API
    axios.get('http://localhost:3001/gestionDB/devis/')
      .then(response => {
        if (response.data) {
          const today = new Date();
          const updatedDevis = response.data.map(d => {
            if (new Date(d.validite) < today && d.etat !== 'expiré') {
              // Update only if necessary
              d.etat = 'expiré';
              // Appeler l'API pour mettre à jour le statut dans la base de données
              axios.put(`http://localhost:3001/gestionDB/devis/${d._id}`, { etat: 'expiré' })
                .then(() => {
                  console.log(`Devis ${d._id} mis à jour dans la base de données.`);
                })
                .catch(error => {
                  console.error(`Erreur lors de la mise à jour du devis ${d._id} :`, error);
                });
            }
            return d;
          });
          setDevis(updatedDevis);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des devis :', error));
  }, []); // Ce useEffect ne dépend de rien d'autre que l'initialisation du composant
  
  

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
  
    try {
      const DevisToUpdate = devis.find(d => d._id === selectedProduct.devisId);
      if (!DevisToUpdate) {
        console.error('Devis introuvable');
        return;
      }
  
      const updatedProducts = DevisToUpdate.produits.map(produit =>
        produit._id === selectedProduct._id
          ? { ...produit, quantite: selectedProduct.quantite, total: parseFloat(selectedProduct.prix_unitaire) * selectedProduct.quantite }
          : produit
      );
  
      const response = await axios.put(`http://localhost:3001/gestionDB/devis/${selectedProduct.devisId}`, {
        produits: updatedProducts,
        statut: DevisToUpdate.statut // Assurez-vous que le statut est inclus si nécessaire
      });
  
      if (response.status === 200) {
        setDevis(devis.map(d => 
          d._id === selectedProduct.devisId ? { ...d, produits: updatedProducts } : d
        ));
        setOpenEditDialog(false);
        setSelectedProduct(null);
      } else {
        console.error('Erreur lors de la mise à jour du devis :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du devis :', error);
    }
  };
  
  const openEditDialogWithProduct = (devisId: string, produit: any) => {
    setSelectedProduct({ ...produit, devisId });
    setOpenEditDialog(true);
  };
  

 


  const handleDeleteProduct = async (devisId: string, produitId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit du devis ?')) {
      try {
        const DevisToUpdate = devis.find(d => d._id === devisId);
        if (!DevisToUpdate) {
          console.error('devis introuvable');
          return;
        }
  
        // Filtrer les produits pour enlever celui à supprimer
        const produitsRestants = DevisToUpdate.produits.filter((produit: { _id: string; }) => produit._id !== produitId);
  
        // Mettre à jour du devis avec les produits restants
        const response = await axios.put(`http://localhost:3001/gestionDB/devis/${devisId}`, {
          produits: produitsRestants
        });
  
        if (response.status === 200) {
          // Mettre à jour l'état local du  devis

          setDevis(devis.map(d => 
            devis._id === devisId ? { ...d, produits: produitsRestants } : d
          ));
        } else {
          console.error('Erreur lors de la mise à jour du devis :', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du devis :', error);
      }
    }
  };
  



  const handleConfirm = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:3001/gestionDB/devis/${id}`, { statut: 'expiré' });
      if (response.status === 200) {
        setDevis(devis.map(d => 
            d._id === id ? { ...d, statut: 'expiré' } : d
        ));
      } else {
        console.error('Erreur lors de la confirmation du devis :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation du devis :', error);
    }
  };

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
            Liste des Devis
          </Typography>
          <br /><br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'blue' }}>
                <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Devis</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Client</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Date de devis</TableCell>
                  <TableCell sx={{color: 'white' , fontSize: '1rem' , fontWeight: 'bold'}}>Date d'Expiration</TableCell>
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
            {devis.map(d => (
                d.produits.map((produit, index) => (
                <TableRow key={`${d._id}-${index}`}  sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  borderBottom: '3px solid #e0e0e0', backgroundColor:  'white',
                  '&:hover': { backgroundColor: '#e0f7fa' },
                }}>
                    {index === 0 && (
                    <TableCell rowSpan={d.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                        {d.num_devis || 'Non spécifié'}
                    </TableCell>
                    )}
                    {index === 0 && (
                    <TableCell rowSpan={d.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                        {d.client_id?.nom || 'Non spécifié'}
                    </TableCell>
                    )}
                    {index === 0 && (
                    <TableCell rowSpan={d.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                        {new Date(d.date_devis).toLocaleDateString()}
                    </TableCell>
                    )}
                     {index === 0 && (
                    <TableCell rowSpan={d.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>
                        {new Date(d.validite).toLocaleDateString()}
                    </TableCell>
                    )}
                    <TableCell>{produit.produit_id?.label || 'Non spécifié'}</TableCell>
                    <TableCell>{produit.quantite}</TableCell>
                    <TableCell>{produit.prix_unitaire.toFixed(2)}</TableCell>
                    <TableCell sx={{ borderRight: '3px solid #f9f9f9' }}>{produit.total.toFixed(2)} </TableCell>
                    {index === 0 && ( <TableCell rowSpan={d.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{d.remise} </TableCell>)}
                    {index === 0 && ( <TableCell rowSpan={d.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{d.taxes} </TableCell>)}
                    {index === 0 && ( <TableCell rowSpan={d.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{d.total_ht} </TableCell>)}
                    {index === 0 && (
                    <TableCell rowSpan={d.produits.length} sx={{ borderRight: '3px solid #f9f9f9' }}>{d.total_ttc} </TableCell> )}
                    {index === 0 && (
                    <TableCell rowSpan={d.produits.length}  sx={{ 
                      borderRight: '3px solid #f9f9f9',color: d.etat === 'en cours' ? 'blue' : d.etat === 'accepté' ? 'green' : d.etat === 'expiré' ? 'red' : 'inherit', fontWeight: 'bold'
                    }}>
                        {d.etat}
                    </TableCell>
                    )}
                    <TableCell>
                      <IconButton onClick={() => openEditDialogWithProduct(d._id, produit)} aria-label="edit" disabled={d.statut === 'expiré'} >
                          <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteProduct(d._id, produit._id)} aria-label="delete" disabled={d.statut === 'expiré'} style={{ display: 'none' }}>
                          <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleConfirm(d._id)} aria-label="confirm" disabled={d.statut === 'expiré'} >
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
                inputProps={{
                  min: 1,
                }}
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
    
      </>
   
  );
}


export default Devis
