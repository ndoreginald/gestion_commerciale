import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import MostProductSales from './MostProductSales';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const defaultChartData = {
  labels: [],
  datasets: [],
};

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

function MonthlySalesChart() {
  const [chartData, setChartData] = useState(defaultChartData);

  useEffect(() => {
    axios
      .get('http://localhost:3001/gestionDB/vente/monthly-sales')
      .then((response) => {
        const data = response.data;
        const labels: string[] = [];
        const datasets: Record<string, any> = {};

        data.forEach((item: { _id: { year: number; month: number }; totalSales: number }) => {
          const { year, month } = item._id;
          const label = `${year}-${String(month).padStart(2, '0')}`;
          if (!labels.includes(label)) {
            labels.push(label);
          }
          if (!datasets[year]) {
            datasets[year] = {
              label: String(year),
              data: Array(labels.length - 1).fill(0), // Remplir les données manquantes avec des zéros
              fill: false,
              borderColor: getRandomColor(),
              tension: 0.1,
            };
          }
          datasets[year].data.push(item.totalSales);
        });

        // S'assurer que tous les datasets ont le même nombre de données
        Object.values(datasets).forEach((dataset) => {
          while (dataset.data.length < labels.length) {
            dataset.data.push(0);
          }
        });

        const formattedDatasets = Object.values(datasets);
        const updatedChartData = {
          labels: labels.sort(),
          datasets: formattedDatasets,
        };

        setChartData(updatedChartData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000, // Ajustez cette valeur en fonction de vos données
        },
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px' }}>
          <Header />
          <br /><br />
          <Typography variant="h4" style={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center', margin: '20px 0' }}>
           Graphe des Ventes par mois
          </Typography>
          <Line data={chartData} options={options} />
         
          <MostProductSales />
        </main>
      </div>
    </ThemeProvider>
  );
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default MonthlySalesChart;
