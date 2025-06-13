
import { useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
//import FolderIcon from '@mui/icons-material/Folder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import ShopIcon from '@mui/icons-material/Shop';
import InventoryIcon from '@mui/icons-material/Inventory';
import { ReceiptLong, PostAdd, CreateNewFolder, MailOutline } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.tsx';
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard', roles: ['admin', 'user'] },
  { text: 'Users', icon: <PeopleIcon />, path: '/users', roles: ['admin'] },
  { text: 'Clients', icon: <PeopleIcon />, path: '/clients', roles: ['admin', 'user'] },
  { text: 'Fournisseurs', icon: <PeopleIcon />, path: '/fournisseurs', roles: ['admin', 'user'] },
  { text: 'Categorie', icon: <CategoryIcon />, path: '/categories', roles: ['admin', 'user'] },
  { text: 'Products', icon: <ListAltIcon />, path: '/products', roles: ['admin', 'user'] },
  { text: 'Ventes', icon: <ReceiptLong />, path: '/ventes', roles: ['admin'] },
  { text: 'Achats', icon: <ShopIcon />, path: '/achats', roles: ['admin'] },
  { text: 'Devis', icon: <PostAdd />, path: '/devis', roles: ['admin', 'user'] },
  { text: 'Stocks', icon: <InventoryIcon />, path: '/stocks', roles: ['admin', 'user'] },
  { text: 'Logout', icon: <LogoutIcon />, path: '/logout', action: 'logout', roles: ['admin', 'user'] },
  // Add more items as needed
];


function Sidebar() {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();
  const colorMode = { toggleColorMode: () => {} };
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3001/gestionDB/logout'); 
      logout();
      navigate('/', { replace: true }); // Redirect to sign-in page
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleMenuItemClick = (item: any) => {
    if (item.action === 'logout') {
      handleLogout();
    } else {
      navigate(item.path, { replace: true });
    }
  };

  const filteredMenuItems = menuItems.filter(item => userRole && item.roles.includes(userRole));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          backgroundColor: '#1976d2',
          color: 'white'
        }}
      >
        {/* Logo et Nom */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={"img/statProduct.png"} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%'}} />
          <Typography variant="h6" noWrap sx={{ marginLeft: 2 , fontWeight: 'bold'}}>
            MyApp
          </Typography>
        </Box>
        
        {/* Boutons de Contrôle */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
      
        </Box>
      </Box>
      <Divider />
      
      <List component="nav">
        {filteredMenuItems.map((item, index) => ( 
        
          <ListItem
            button
            key={index}
            onClick={() => handleMenuItemClick(item)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
