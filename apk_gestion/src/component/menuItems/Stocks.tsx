
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '../../layout/Header';
import Sidebar from '../../layout/Sidebar';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import TableChartIcon from '@mui/icons-material/TableChart';

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



function Stocks (){

  const navigate = useNavigate();

    return (
      <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px' }}>
        <Header />
       
       <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh', // Full height to center vertically
      }}
    >
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        {/* Stock In */}
        <Grid item xs={4} sm={3}>
          <div style={{ textAlign: 'center' }}>
            <a href="#" onClick={() => navigate(`/stocks/List`)}>
              <TableChartIcon 
                style={{ fontSize: '60px', color: '#1976d2', marginBottom: '10px', width: 100, height: 100 }} 
              />
            </a>
            <Typography>Stock</Typography>
          </div>
        </Grid>

        {/* Stock Out */}
        <Grid item xs={4} sm={3}>
          <div style={{ textAlign: 'center' }}>
            <a href="#" onClick={() => navigate(`/stocks/out`)}>
              <ArrowCircleUpIcon 
                style={{ fontSize: '60px', color: 'red', marginBottom: '10px', width: 100, height: 100 }} 
              />
            </a>
            <Typography>Stock Out</Typography>
          </div>
        </Grid>

        {/* Stock In */}
        <Grid item xs={4} sm={3}>
          <div style={{ textAlign: 'center' }}>
            <a href="#" onClick={() => navigate(`/stocks/in`)}>
              <ArrowCircleDownIcon 
                style={{ fontSize: '60px', color: 'green', marginBottom: '10px', width: 100, height: 100 }} 
              />
            </a>
            <Typography>Stock In</Typography>
          </div>
        </Grid>

        {/* Force next columns to break to new line */}
        <Grid item xs={12}>
          <div style={{ height: 0 }}></div>
        </Grid>
      </Grid>
    </div>
        </main>
      </div>
    </ThemeProvider>
      </>
    )

}

export default Stocks
