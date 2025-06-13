import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Paper, TextField, Typography, Button, Grid, MenuItem, IconButton, Autocomplete, TableHead, TableRow, TableCell } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AddCircleIcon from '@mui/icons-material/AddCircle';


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

function VenteAdd() {

  const generatePDF = () => {
    const input = document.getElementById('form-to-pdf');
    html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save("form.pdf");
        })
        .catch((error) => {
            console.error("Could not generate PDF", error);
        });
};

  const [formData, setFormData] = useState({
    client_id: '',
    num_vente: 0,
    remise: 0,
    taxes: 0,
    total_ht: 0,
    total_ttc: 0,
    date_vente: new Date().toISOString().split('T')[0],
    produits: [{ produit_id: '',label:'', quantite: '', prix_unitaire: '', total: 0 }],
  });
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/gestionDB/client/')
      .then(response => setClients(response.data))
      .catch(error => console.error('Erreur lors de la récupération des clients :', error));

    axios.get('http://localhost:3001/gestionDB/produit/')
      .then(response => setProduits(response.data))
      .catch(error => console.error('Erreur lors de la récupération des produits :', error));

      const fetchLatestNumVente = async () => {
        try {
            const response = await axios.get('http://localhost:3001/gestionDB/vente/next-num-vente');
            const nextNumVente  = response.data.nextNumVente ;
            setFormData(prevState => ({
                ...prevState,
                num_vente: nextNumVente 
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération du dernier numéro d\'vente:', error);
        }
    };
    fetchLatestNumVente();
  }, []);



  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const numVenteResponse = await axios.get('http://localhost:3001/gestionDB/vente/next-num-vente');
      const nextNumVente = numVenteResponse.data.nextNumVente;
        // Préparer les données de la vente
        const data = {
            ...formData,
            produits: formData.produits.map(p => ({
                ...p,
                prix_unitaire: parseFloat(p.prix_unitaire),
                quantite: parseInt(p.quantite),
                total: parseFloat(p.prix_unitaire) * parseInt(p.quantite),
            })),
            date_vente: new Date(formData.date_vente).toISOString(),
            num_vente: nextNumVente,
            remise: formData.remise,
            taxes: formData.taxes,
            total_ht: formData.total_ht,
            total_ttc: formData.total_ttc,
        };
        
        // Ajouter la vente
        const response = await axios.post('http://localhost:3001/gestionDB/vente/', data);

        // Pour chaque produit, mettre à jour la quantité actuelle dans le stock
        await Promise.all(formData.produits.map(async (p) => {
            try {
                // Récupérer le stock actuel pour ce produit
                const stockResponse = await axios.get(`http://localhost:3001/gestionDB/stock/produit/${p.produit_id}`);
                const stockData = stockResponse.data;
                const quantiteActuelle = stockData ? stockData.quantite_actuelle : 0;
                const quantiteSortie = parseInt(p.quantite);

                // Vérifier si la quantité actuelle est suffisante pour la sortie
                if (quantiteActuelle < quantiteSortie) {
                    throw new Error(`Quantité insuffisante en stock pour le produit ${p.produit_id}. Quantité actuelle: ${quantiteActuelle}, Quantité demandée: ${quantiteSortie}`);
                }

                // Mettre à jour le stock avec la nouvelle quantité actuelle
                await axios.post('http://localhost:3001/gestionDB/stock/out', {
                    client_id: formData.client_id,
                    produits: [{
                        produit_id: p.produit_id,
                        quantite_sortie: quantiteSortie,
                        quantite_actuelle: quantiteActuelle - quantiteSortie, // Soustraire la quantité vendue
                        quantite_entree: 0, // Quantité d'entrée est 0 pour une sortie
                    }]
                });
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    // Si le stock n'est pas trouvé, créer un nouveau stock pour ce produit
                    await axios.post('http://localhost:3001/gestionDB/stock/out', {
                        client_id: formData.client_id,
                        produits: [{
                            produit_id: p.produit_id,
                            quantite_entree: 0,
                            quantite_actuelle: p.quantite, // Quantité actuelle est la quantité d'entrée pour un nouveau stock
                            quantite_sortie: p.quantite, // Quantité de sortie
                        }]
                    });
                } else {
                    throw error; // Réélever l'erreur si ce n'est pas un 404
                }
            }
        }));

        // Réinitialiser le formulaire après l'ajout réussi
        setFormData({
            client_id: '',
            num_vente: 0,
            remise: 0,
            taxes: 0,
            total_ht: 0,
            total_ttc: 0,
            date_vente: new Date().toISOString().split('T')[0],
            produits: [{ produit_id: '', label: '', quantite: '', prix_unitaire: '', total: 0 }],
        });
        console.log('Vente ajoutée avec succès:', response.data);
        alert('Vente ajoutée avec succès');
        navigate('/ventes', { replace: true });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('Le serveur a répondu avec:', error.response.data);
                alert(`Erreur: ${error.response.data.message}`);
            } else if (error.request) {
                console.error('Aucune réponse reçue:', error.request);
            } else {
                console.error('Erreur lors de la configuration de la requête:', error.message);
            }
        } else {
            console.error('Erreur inattendue:', error);
        }
    }
};


  const handleClientChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProduitChange = (e, index: number) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    
    setFormData(prevState => {
      const produits = [...prevState.produits];
      produits[index] = {
        ...produits[index],
        [name]: isNaN(numericValue) ? '0' : value,
        total: name === 'quantite'
          ? (isNaN(numericValue) ? 0 : numericValue) * parseFloat(produits[index].prix_unitaire || '0')
          : produits[index].total,
      };
      return {
        ...prevState,
        produits,
      };
    });
  };

  const handleProduitSelectChange = async (e , index: number) => {
    const produitId = e.target.value as string;
    const selectedProduit = produits.find(p => p._id === produitId);
    
    if (selectedProduit) {
      setFormData(prevState => {
        const produits = [...prevState.produits];
        produits[index] = {
          ...produits[index],
          produit_id: produitId,
          prix_unitaire: selectedProduit.prix_vente,
          total: parseFloat(selectedProduit.prix_vente) * parseInt(produits[index].quantite || '0', 10),
        };
        return {
          ...prevState,
          produits,
        };
      });
    }
  };

  const addProduct = () => {
    setFormData(prevState => ({
      ...prevState,
      produits: [...prevState.produits, { produit_id: '', label:'',quantite: '', prix_unitaire: '', total: 0 }],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData(prevState => {
      const produits = prevState.produits.filter((_, i) => i !== index);
      return {
        ...prevState,
        produits,
      };
    });
  };

  // Fonction pour calculer le total général
  const getTotalGeneral = () => {
    return formData.produits.reduce((acc, produit) => acc + produit.total, 0).toFixed(2);
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

  const handleSave = async () => {
    try {
      // Envoyer les données du nouveau client au serveur
      const response = await axios.post('http://localhost:3001/gestionDB/client/', newClient);

      // Mettre à jour le client sélectionné dans formData avec l'ID du nouveau client
      setFormData({
        ...formData,
        client_id: response.data._id,
      });

      // Optionnel: ajouter le nouveau client à la liste des clients
      clients.push(response.data);

      // Masquer le formulaire après l'enregistrement
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du fournisseur :", error);
    }
  };

  const calculateTotals = () => {
    const totalHT = formData.produits.reduce((sum, produit) => {
        return sum + (parseInt(produit.quantite) * parseFloat(produit.prix_unitaire));
    }, 0);
    const totalHTAfterDiscount = totalHT - formData.remise;
    const totalTTC = totalHTAfterDiscount + (totalHTAfterDiscount * (formData.taxes / 100));

    setFormData({ ...formData, total_ht: totalHTAfterDiscount, total_ttc: totalTTC });
    };
    useEffect(() => {
        calculateTotals();
    }, [formData.produits, formData.remise, formData.taxes]);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px' }}>
          <Header />
          <br /><br />
          <Typography variant="h4" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0', textDecoration: 'underline' }}>
              Ajouter une nouvelle vente
            </Typography>
          <Paper style={{ padding: '40px', maxWidth: '900px', margin: 'auto', backgroundColor: '#f5f5f5'}}>
            
            <form id="form-to-pdf" onSubmit={(e) => {
                e.preventDefault();
                // Première confirmation
                if (window.confirm("Êtes-vous sûr de vouloir ajouter cette vente ?")) {
                    handleSubmit(e);
                } }}>
              <fieldset style={{backgroundColor: 'white' ,border: '1px solid #ddd', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
                <legend style={{ fontWeight: 'bold' }}></legend>
                <Grid container spacing={3}>
                <Grid container item xs={12} style={{ alignItems: 'center' }} spacing={2}>
                  <Grid item xs={2}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Num Vente:
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      variant="outlined"
                      value={formData.num_vente}
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
                      id="date_vente"
                      name="date_vente"
                      value={formData.date_vente.split('T')[0]} 
                      onChange={handleClientChange}
                      label="Date de la vente"
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

                  {/* Boutons de validation et d'annulation */}
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
                  <Grid item xs={5}>
                      <Autocomplete
                          options={produits.filter((p) => p.statut !== 'inactif')}
                          getOptionLabel={(option) => option.label || ''}
                          value={produits.find((p) => p._id === produit.produit_id) || null}
                          onChange={(event, newValue) => {
                              const updatedProduits = [...formData.produits];
                              updatedProduits[index] = {
                                  ...updatedProduits[index],
                                  produit_id: newValue ? newValue._id : '',
                                  label: newValue ? newValue.label : '',
                                  prix_unitaire: newValue ? newValue.prix_vente : 0,
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
                          //label="Prix unitaire "
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
                          //label="Total "
                          fullWidth
                          InputProps={{ readOnly: true }}
                      />
                  </Grid>
                  <Grid item xs={1}>
                      <IconButton onClick={() => removeProduct(index)} aria-label="delete">
                          <DeleteIcon />
                      </IconButton>
                  </Grid>
              </Grid>
              </fieldset>
          ))}

      <IconButton  onClick={addProduct} ><AddCircleIcon /> </IconButton>
              <br />
              <br />

            <div>
                <span className='text-danger'>
                        ----------------------------------------------------------------------------------------------------------------------------------------------------
                </span>
            </div><br />
              <fieldset style={{backgroundColor: 'white' ,border: '1px solid #ddd', borderRadius: '4px', padding: '16px', marginTop: '16px' }}>
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
           
          </Grid>
                
              </fieldset>
              <Grid item xs={12} style={{ marginTop: '24px' }} >
                <Grid container spacing={2} justifyContent="center">
                
                  <Grid item xs={12} sm={4}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                    Ajouter la vente
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ 
                        backgroundColor: '#d32f2f',
                        '&:hover': {
                          backgroundColor: '#b71c1c',
                        }
                      }}
                      onClick={() => navigate(`/ventes`, { replace: true })}
                    >
                      Annuler la vente
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button type="submit" variant="contained" fullWidth  sx={{ 
                        backgroundColor: '#388e3c',  '&:hover': {backgroundColor: '#2e7d32', 
                        }
                      }}
                      onClick={generatePDF}
                    >
                    Download PDF
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
}

export default VenteAdd;
