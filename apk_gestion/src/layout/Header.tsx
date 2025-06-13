import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';



const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function Header () {

  const location = useLocation();
  const navigate = useNavigate();


  const renderNavItems = () => {
    switch (location.pathname) {
      case '/dashboard':
        return (
          <>
           <IconButton color="inherit"><NotificationsIcon /></IconButton>
           <IconButton color="inherit"><AccountCircle /> </IconButton>
          </>
        );
       
        case '/categories':
          return (
            <>
              <IconButton color="inherit"  onClick={() => navigate("/categories/Add", { replace: true })}><AddCircleIcon/></IconButton>
                <IconButton color="inherit" component={Link} to="#"><BarChartIcon/></IconButton>
                
            </>
          );
      case '/products':
       
        return (
          <>
            <IconButton color="inherit"  onClick={() => navigate("/products/Add", { replace: true })}><AddCircleIcon/></IconButton>
                <IconButton color="inherit" component={Link} to="#"><BarChartIcon/></IconButton>
              
          </>
        );
      case '/clients':
        
        return (
          <>
            <IconButton color="inherit"  onClick={() => navigate("/clients/clientAdd", { replace: true })}><AddCircleIcon/></IconButton>
            <IconButton color="inherit"  onClick={() => navigate("/clients/statistic", { replace: true })}><BarChartIcon/></IconButton>
                
          </>
        );
        case '/fournisseurs':
        return (
          <>
                <IconButton color="inherit"  onClick={() => navigate("/fournisseurs/Add", { replace: true })}><AddCircleIcon/></IconButton>
                <IconButton color="inherit"  onClick={() => navigate("/fournisseurs/statistic", { replace: true })}><BarChartIcon/></IconButton>
               
          </>
        );
        case '/users':
          return (
            <>
              <IconButton color="inherit"  onClick={() => navigate("/users/userAdd", { replace: true })}><AddCircleIcon/></IconButton>
             
            </>
          );
          case '/ventes':
          return (
            <>
              
                <IconButton color="inherit"  onClick={() => navigate("/ventes/venteAdd", { replace: true })}><AddCircleIcon/></IconButton>
                <IconButton color="inherit"  onClick={() => navigate("/ventes/statistic", { replace: true })}><BarChartIcon/></IconButton>
                  
            </>
          );
          case '/devis':
          return (
            <>
              
                <IconButton color="inherit"  onClick={() => navigate("/devis/Add", { replace: true })}><AddCircleIcon/></IconButton>
                <IconButton color="inherit" component={Link} to="#"><BarChartIcon/></IconButton>
                  
            </>
          );
            case '/achats':
              return (
                <>
                  <IconButton color="inherit"  onClick={() => navigate("/achats/achatAdd", { replace: true })}><AddCircleIcon/></IconButton>
                 <IconButton color="inherit"  onClick={() => navigate("/achats/statistic", { replace: true })}><BarChartIcon/></IconButton>
                </>
              );
      default:
        return null;
    }
  };


  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
        My Application
        </Typography>
        
        <div style={{ flexGrow: 1 }} />
        {renderNavItems()}
        
      </Toolbar>
    </AppBar>
  );
}

export default Header;
