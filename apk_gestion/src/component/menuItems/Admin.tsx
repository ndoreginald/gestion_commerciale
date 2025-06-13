
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './Dashboard';
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


function Admin () {

    return (
      <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App" style={{ display: 'flex' }}>
        
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '10px' }}>
        <Header />
       <br /><br />
          <Dashboard />
        </main>
      </div>
    </ThemeProvider>
    
      </>
    )
  
}

export default Admin;
