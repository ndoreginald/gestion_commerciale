
import { createTheme, CssBaseline } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled, ThemeProvider } from '@mui/material/styles';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';


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


function Dashboard() {
  return (

    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px' }}>
        <Header />
       <br /><br />
       <div  className='mb-2'></div>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Item>
          <Typography variant="h6">Paiements les plus effectués</Typography>
          
        </Item>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Item>
          <Typography variant="h6">Commandes en temps réel</Typography>
          
        </Item>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Item>
          <Typography variant="h6">Commandes effectuées</Typography>
          
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item>
          <Typography variant="h6">Produits les plus vendus</Typography>
          <br /><br />
        </Item>
      </Grid>
      
      <Grid item xs={12}>
        <Item>
          <Typography variant="h6">Ventes mensuelles</Typography>
          
          <br />
        </Item>
      </Grid>
    </Grid>
        </main>
      </div>
    </ThemeProvider>
    
      </>
   
  );
}

export default Dashboard;
