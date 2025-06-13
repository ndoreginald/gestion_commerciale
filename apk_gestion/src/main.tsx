import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AchatAdd from './component/achat/AchatAdd.tsx';
import FournisseurAdd from './component/fournisseur/FournisseurAdd.tsx';
import CategorieAdd from './component/categorie/CategorieAdd.tsx';
import CategorieEdit from './component/categorie/CategorieEdit.tsx';
import ProduitAdd from './component/produit/ProduitAdd.tsx';
import ProduitEdit from './component/produit/ProduitEdit.tsx';
import AchatEdit from './component/achat/AchatEdit.tsx';
import VenteAdd from './component/vente/VenteAdd.tsx';
import StockIn from './component/stock/StockIn.tsx';
import StockOut from './component/stock/StockOut.tsx';
import AdminProtectedRoute from './auth/AdminProtectedRoute.tsx';
import SignIn from './auth/SignIn.tsx';
import SignUp from './auth/SignUp.tsx';
import Dashboard from './component/menuItems/Dashboard.tsx';
import Products from './component/menuItems/Products.tsx';
import Clients from './component/menuItems/Clients.tsx';
import Stocks from './component/menuItems/Stocks.tsx';
import Fournisseurs from './component/menuItems/Fournisseurs.tsx';
import UserEdit from './component/user/UserEdit.tsx';
import UserAdd from './component/user/UserAdd.tsx';
import Users from './component/menuItems/Users.tsx';
import Ventes from './component/menuItems/Ventes.tsx';
import Achats from './component/menuItems/Achats.tsx';
import ClientAdd from './component/client/ClientAdd.tsx';
import ClientEdit from './component/client/ClientEdit.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import DevisAdd from './component/devis/DevisAdd.tsx';
import FournisseurEdit from './component/fournisseur/FournisseurEdit.tsx';
import MonthlySalesChart from './component/vente/MonthlySalesChart.tsx';
import MostClientSales from './component/vente/MostClientSales.tsx';
import MontlyPurchases from './component/achat/MontlyPurchases.tsx';
import MostSupplierPurchases from './component/achat/MostSupplierPurchases.tsx';
import { ColorModeProvider , useColorMode} from './layout/ColorModeContext.tsx';
import StockList from './component/stock/StockList.tsx';
import Devis from './component/menuItems/Devis.tsx';
import Categories from './component/menuItems/Categories.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
  <ColorModeProvider>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/Add" element={<CategorieAdd />} />
          <Route path="/categories/Edit/:id" element={<CategorieEdit />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/Add" element={<ProduitAdd/>} />
          <Route path="/products/Edit/:id" element={<ProduitEdit />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/clientAdd" element={<ClientAdd />} />
          <Route path="/clients/statistic" element={<MostClientSales />} />
          <Route path="/clients/clientEdit/:id" element={<ClientEdit />} />
          <Route path="/fournisseurs" element={<Fournisseurs />} />
          <Route path="/fournisseurs/Edit/:id" element={<FournisseurEdit />} />
          <Route path="/fournisseurs/Add" element={<FournisseurAdd />} />
          <Route path="/fournisseurs/statistic" element={<MostSupplierPurchases/>} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/stocks/List" element={<StockList />} />
          <Route path="/stocks/in" element={<StockIn />} />
          <Route path="/stocks/out" element={<StockOut />} />
          <Route path="/devis/Add" element={<DevisAdd />} />
          <Route path="/devis" element={<Devis />} />


          {/* Protected routes for admin */}
          <Route element={<AdminProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/users/userEdit/:id" element={<UserEdit />} />
            <Route path="/users/userAdd" element={<UserAdd />} />
            <Route path="/users" element={<Users />} />
            <Route path="/ventes" element={<Ventes />} />
            <Route path="/ventes/venteAdd" element={<VenteAdd />} />
            <Route path="/ventes/statistic" element={<MonthlySalesChart />} />
            <Route path="/achats/achatAdd" element={<AchatAdd />} />
            <Route path="/achats/Edit/:id" element={<AchatEdit />} />
            <Route path="/achats" element={<Achats />} />
            <Route path="/achats/statistic" element={<MontlyPurchases />} />
          </Route>
          
        </Routes>
      </Router>
    </AuthProvider>
    </ColorModeProvider>
  </>
);
