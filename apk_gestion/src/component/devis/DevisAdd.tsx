import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Paper, Grid, TextField, Typography, IconButton, Autocomplete, ThemeProvider, CssBaseline, createTheme, TableHead, TableRow, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
  

interface Product {
  produit_id: string;
  quantite: number;
  prix_unitaire: number;
  total: number;
}

interface Devis {
  client_id: string;
  date_devis: string;
  produits: Product[];
}

function DevisAdd() {

    useEffect(() => {
      const fetchLatestNumDevis = async () => {
        try {
            const response = await axios.get('http://localhost:3001/gestionDB/devis/next-num-devis');
            const latestNumDevis = response.data.latestNumDevis;
            setFormData(prevState => ({
                ...prevState,
                num_devis: latestNumDevis
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération du dernier numéro de devis:', error);
        }
    };
    fetchLatestNumDevis();

        axios.get('http://localhost:3001/gestionDB/client/')
          .then(response => setClients(response.data))
          .catch(error => console.error('Erreur lors de la récupération des clients :', error));
    
        axios.get('http://localhost:3001/gestionDB/produit/')
          .then(response => setProduits(response.data))
          .catch(error => console.error('Erreur lors de la récupération des produits :', error));
      }, []);

  const [formData, setFormData] = useState({
    client_id: '',
    num_devis: 0,
    date_devis: new Date().toISOString().split('T')[0],
    validite: new Date().toISOString().split('T')[0],
    remise: 0,
    taxes: 0,
    total_ht: 0,
    total_ttc: 0,
    produits: [{ produit_id: '', quantite: 0 ,prix_unitaire: 0, total: 0 }],
});

  const [error, setError] = useState(null);
  const [clients, setClients] = useState<any[]>([]);
  const [produits, setProduits] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleProduitChange = (e, index: number) => {
    const { name, value } = e.target;
    const updatedProduits = [...formData.produits];
    updatedProduits[index] = { 
        ...updatedProduits[index], 
        [name]: parseFloat(value) || 0 
    };
    updatedProduits[index].total = updatedProduits[index].quantite * updatedProduits[index].prix_unitaire;
    setFormData({ ...formData, produits: updatedProduits });
};


  const addProduct = () => {
    setFormData({
      ...formData,
      produits: [...formData.produits, { produit_id: '', quantite: 0, prix_unitaire: 0, total: 0 }],
    });
  };

  const removeProduct = (index: number) => {
    const updatedProduits = [...formData.produits];
    updatedProduits.splice(index, 1);
    setFormData({ ...formData, produits: updatedProduits });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
        // Obtenir le prochain numéro de devis
        const numDevisResponse = await axios.get('http://localhost:3001/gestionDB/devis/next-num-devis');
        const nextNumDevis = numDevisResponse.data.nextNumDevis;

        // Préparer les données du devis
        const data = {
            ...formData,
            produits: formData.produits.map(p => ({
              ...p,
              prix_unitaire: p.prix_unitaire,
              quantite: p.quantite,
              total: p.prix_unitaire * p.quantite,
            })),
            date_devis: new Date(formData.date_devis).toISOString(),
            validite: new Date(formData.validite).toISOString(),
            num_devis: nextNumDevis,
            remise: formData.remise,
            taxes: formData.taxes,
            total_ht: formData.total_ht,
            total_ttc: formData.total_ttc,
          };

        // Envoyer les données au serveur
        const response = await axios.post('http://localhost:3001/gestionDB/devis/', data);
        
        // Réinitialiser les données du formulaire
        setFormData({
            client_id: '',
            num_devis: 0,
            date_devis: new Date().toISOString().split('T')[0],
            validite: new Date().toISOString().split('T')[0],
            remise: 0,
            taxes: 0,
            total_ht: 0,
            total_ttc: 0,
            produits: [{ produit_id: '', quantite: 0, prix_unitaire: 0, total: 0 }],
        });

        console.log('Devis ajoutée avec succès:', response.data);
        alert('Devis ajoutée avec succès');
        navigate('/devis', { replace: true });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Axios-specific error handling
            if (error.response) {
                console.error('Server responded with:', error.response.data);
                alert(`Error: ${error.response.data.message}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        } else {
            // Non-Axios-specific error handling (other types of errors)
            console.error('Unexpected error:', error);
        }
    }
};


  const getTotalGeneral = () => {
    return formData.produits.reduce((acc, produit) => acc + produit.total, 0);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:3001/gestionDB/client/', newClient);
      setFormData({
        ...formData,
        client_id: response.data._id,
      });
      clients.push(response.data);
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du devis :", error);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({
    nom: '',
    adresse: '',
    email: '',
    telephone: '',
    statut: 'Actif',
  });

  const handleChange = (e) => {
    setNewClient({
      ...newClient,
      [e.target.name]: e.target.value,
    });
  };


  const calculateTotals = () => {
    const totalHT = formData.produits.reduce((sum, produit) => {
        return sum + (produit.quantite * produit.prix_unitaire);
    }, 0);
    const totalHTAfterDiscount = totalHT - formData.remise;
    const totalTTC = totalHTAfterDiscount + (totalHTAfterDiscount * (formData.taxes / 100));

    setFormData({ ...formData, total_ht: totalHTAfterDiscount, total_ttc: totalTTC });
    };
    useEffect(() => {
        calculateTotals();
    }, [formData.produits, formData.remise, formData.taxes]);

    const handleClientChange = (e: { target: { name: any; value: any; }; }) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <div className="App" style={{ display: 'flex' }}>
      
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '10px' }}>
      <Header />
     <br /><br />
     <Typography variant="h4" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0', textDecoration: 'underline' }}>
      Ajouter un nouveau devis
       </Typography>
        
    <Paper style={{ padding: '40px', maxWidth: '900px', margin: 'auto',backgroundColor: '#f5f5f5' }}>
     
      <form onSubmit={handleSubmit}>
        <fieldset style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '16px', marginBottom: '16px',backgroundColor: 'white' }}>
          <legend style={{ fontWeight: 'bold' }}></legend>
          <Grid container spacing={3}>
                <Grid container item xs={12} style={{ alignItems: 'center' }} spacing={2}>
                  <Grid item xs={2}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Num Devis:
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      variant="outlined"
                      value={formData.num_devis}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} /> {/* Empty grid item for spacing */}
                  <Grid item xs={4}>
                    <TextField
                      type="date"
                      id="date_devis"
                      name="date_devis"
                      value={formData.date_devis.split('T')[0]} 
                      onChange={handleClientChange}
                      label="Date du devis"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: true }}
                      required
                    />
                  </Grid>
                </Grid>

                <Grid item xs={2}>
                    <Typography variant="h6" gutterBottom color="primary">
                    Clients:
                    </Typography>
                  </Grid>
                <Grid item xs={4}>
                <Autocomplete
                  options={clients}
                  getOptionLabel={(option) => option.nom || ''}
                  value={clients.find(f => f._id === formData.client_id) || null}
                  isOptionEqualToValue={(option, value) => option._id === value}
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      client_id: newValue ? newValue._id : '',
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      //label="Client"
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
                    New
                </Button>
              </Grid>
              </Grid>

            {showForm && (
  <Grid container spacing={3} style={{ marginTop: '16px' }}>
    {/* Première ligne : Nom et Adresse */}
    <Grid item xs={12} sm={6}>
      <TextField
        label="Nom"
        name="nom"
        value={newClient.nom}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Adresse"
        name="adresse"
        value={newClient.adresse}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
    </Grid>

    {/* Deuxième ligne : Email et Téléphone */}
    <Grid item xs={12} sm={6}>
      <TextField
        label="Email"
        name="email"
        value={newClient.email}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Téléphone"
        name="telephone"
        value={newClient.telephone}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{
          inputMode: 'numeric', // Affiche un pavé numérique sur mobile
          pattern: '[0-9]*' // Accepte uniquement les chiffres
        }}
      />
    </Grid>

    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>
        <Button color="primary" onClick={handleSave} style={{ color: 'green', fontSize: '2rem' }}>
          <CheckCircleIcon style={{ fontSize: '2rem' }} />
        </Button>
      </Grid>
      <Grid item>
        <IconButton color="secondary" onClick={() => setShowForm(false)} style={{ color: 'red', fontSize: '2rem' }}>
          <CancelIcon style={{ fontSize: '2rem' }} />
        </IconButton>
      </Grid>
    </Grid>
  </Grid>
)}

        </fieldset><br />
            <div>
                <span className='text-danger'>
                        -----------------------------------------------------------------------------------------------------------------------------------------------------
                </span>
            </div><br />
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey' }}>
                <TableCell style={{ color: 'white' , fontSize: '1rem' ,fontWeight: 'bold', width: '40%' , textAlign: 'center'}}>Désignation</TableCell>
                <TableCell style={{ color: 'white' , fontSize: '1rem' ,fontWeight: 'bold', width: '20%',textAlign: 'center'}}>Quantité</TableCell>
                <TableCell style={{ color: 'white' , fontSize: '1rem' ,fontWeight: 'bold', width: '20%', textAlign: 'center'}}>Prix unitaire</TableCell>
                <TableCell style={{ color: 'white' , fontSize: '1rem' ,fontWeight: 'bold', width: '20%', }}>Total</TableCell>
                <TableCell style={{ width: '10%' }}></TableCell> {/* Empty cell for delete icon */}
              </TableRow>
            </TableHead>
        {formData.produits.map((produit, index) => (
        <fieldset key={index} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '16px', marginBottom: '4px', backgroundColor: 'white' }}>
            <Grid container spacing={2} alignItems="center" >
            <Grid item xs={5} >
                <Autocomplete
                options={produits.filter((p) => p.statut !== 'inactif')}
                getOptionLabel={(option) => option.label || ''}
                value={produits.find((p) => p._id === produit.produit_id) || null}
                onChange={(event, newValue) => {
                    const updatedProduits = [...formData.produits];
                    updatedProduits[index] = {
                    ...updatedProduits[index],
                    produit_id: newValue ? newValue._id : '',
                    prix_unitaire: newValue ? newValue.prix_achat : 0,
                    
                    };
                    setFormData({ ...formData, produits: updatedProduits });
                }}
                renderInput={(params) => (
                    <TextField {...params} 
                    //label="Produit" 
                    fullWidth required />
                )}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                type="number"
                name="quantite"
                value={produit.quantite}
                onChange={(e) => handleProduitChange(e, index)}
                //label="Quantité"
                fullWidth
                required
                inputProps={{
                  min: 1, // Valeur minimale autorisée
                }}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                type="number"
                name="prix_unitaire"
                value={produit.prix_unitaire}
                //label="Prix unitaire"
                fullWidth
                InputProps={{ readOnly: true }}
                required
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                type="number"
                name="total"
                value={produit.total}
                //label="Total"
                fullWidth
                InputProps={{ readOnly: true }}
                />
            </Grid>
            <Grid item xs={1} >
                <IconButton onClick={() => removeProduct(index)} aria-label="delete">
                <DeleteIcon />
                </IconButton>
            </Grid>
            </Grid>
        </fieldset>
        ))}
         <IconButton  onClick={addProduct} ><AddCircleIcon /> </IconButton>
        
        <br /><br />

        <div>
                <span className='text-danger'>
                        -----------------------------------------------------------------------------------------------------------------------------------------------------
                </span>
            </div><br />

        <fieldset style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '16px', marginTop: '16px' , backgroundColor: 'white'}}>
          <legend style={{ fontWeight: 'bold' }}></legend>
          <Grid container spacing={3} alignItems="center">
             {/* Remise */}
            <Grid container item xs={12} >
            <Grid item xs={2} style={{ textAlign: 'right' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Remise:
                    </Typography>
                  </Grid>
              <Grid item xs={2}>
              <TextField
                type="number"
                id="remise"
                name="remise"
                value={formData.remise}
                onChange={(e) => setFormData({ ...formData, remise: parseFloat(e.target.value) || 0 })}
                //label="Remise"
                fullWidth
                InputLabelProps={{ shrink: true }}
                //sx={{ width: 300 }}
                required
                inputProps={{
                  min: 0, // Valeur minimale autorisée
                }}
              />
            </Grid>
            </Grid>
            {/* TVA */}
            <Grid container item xs={12} >
            <Grid item xs={2} style={{ textAlign: 'right' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      TVA:
                    </Typography>
                  </Grid>
              <Grid item xs={2}>
              <TextField
                type="number"
                id="taxes"
                name="taxes"
                value={formData.taxes}
                onChange={(e) => setFormData({ ...formData, taxes: parseFloat(e.target.value) || 0 })}
                //label="Taxes"
                fullWidth
                InputLabelProps={{ shrink: true }}
                //sx={{ width: 300 }}
                required
                inputProps={{
                  min: 0, // Valeur minimale autorisée
                }}
              />
            </Grid>
            </Grid>
             {/* Total HT */}
            <Grid container item xs={12} >
              <Grid item xs={2} style={{ textAlign: 'right' }}>
                <Typography variant="h6" gutterBottom color="primary">
                    Total HT:
                </Typography>
              </Grid>
              <Grid item xs={2} >
              <TextField
                type="number"
                id="total_ht"
                name="total_ht"
                value={formData.total_ht}
                onChange={(e) => setFormData({ ...formData, total_ht: parseFloat(e.target.value) || 0 })}
                //label="Total Hors Taxes"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{readOnly: true,}}
                //sx={{ width: 300 }}
                required
              />
            </Grid>
            </Grid>
            {/* Net à payer */}
            <Grid container item xs={12} >
            <Grid item xs={2} style={{ textAlign: 'right' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Net à payer:
                    </Typography>
                  </Grid>
              <Grid item xs={2}>
              <TextField
                type="number"
                id="total_ttc"
                name="total_ttc"
                value={formData.total_ttc}
                onChange={(e) => setFormData({ ...formData, total_ttc: parseFloat(e.target.value) || 0 })}
                //label="Total TTC"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{readOnly: true,}}
                //sx={{ width: 300 }}
                required
              />
            </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" item xs={12}>
            <Grid item xs={2} >
            <TextField
                      type="date"
                      id="date_devis"
                      name="date_devis"
                      value={formData.date_devis.split('T')[0]} 
                      onChange={handleClientChange}
                      label="Valable du"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: true }}
                      required
                    />
            </Grid>
            <Grid item xs={0.5} />
            <Grid item xs={2} >
              <TextField
                type="date"
                id="validite"
                name="validite"
                value={formData.validite}
                onChange={(e) => setFormData({ ...formData, validite: e.target.value })}
                label="Valale jusqu'au"
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            </Grid>
            
          </Grid>
        </fieldset>

        <Grid item xs={12} style={{ marginTop: '24px' }}>
         
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Ajouter le devis
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained" sx={{ backgroundColor: '#d32f2f','&:hover': {backgroundColor: '#b71c1c',  },   }}
                onClick={() => navigate('/devis')}
              >
                Annuler le devis
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
    </main>
    </div>
    </ThemeProvider>

  );
};

export default DevisAdd;
