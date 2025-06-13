import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import { Typography } from '@mui/material';

// Register the required Chart.js components
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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

function MostProductPurchases() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: '',
        borderColor: '',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    axios.get('http://localhost:3001/gestionDB/achat/purchases/')
      .then(response => {
        const data = response.data;
        const labels = data.map(item => item.name); // Utiliser le nom du produit
        const quantities = data.map(item => item.totalQuantity); // Quantités vendues
  
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Total Quantity Sold',
              data: quantities,
              backgroundColor: 'rgba(75,192,192,0.6)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching sales data:', error);
      });
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        
        <main style={{ flexGrow: 1, padding: '10px' }}>
          
          <br /><br />
          <Typography variant="h4" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0' }}>
           Graphe des Produits les plus Fournis
          </Typography>
          <div style={{ width: '80%', margin: '0 auto' }}>
            {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
              <Bar data={chartData} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}


export default MostProductPurchases
