import React from 'react';
import './index.css';
import { Route, Routes, useLocation } from "react-router-dom";
import Home from './pages/Home';
import SareeDetails from './pages/SareeDetail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';
import ProductDetails from './pages/ProductDetails';
import AdminRoute from './routes/AdminRoute';
import AdminCategories from './pages/AdminCategories';
import AdminProducts from './pages/AdminProducts';
import CollectionPage from './pages/CollectionPage';
import MyProfile from './pages/Profile';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import SubCategoryPage from './pages/SubCategoryPage';
import SubcategoryProductsPage from './pages/SubcategoryProductsPage';
import NewCollection from './pages/NewCollection';
import Myorder from './pages/Myorder';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminDashboard from './pages/AdminDashboard';
import AdminSliderPage from './components/AdminSliderPage';
import Contact from './pages/Contact';

const App = () => {
  const location = useLocation();

  // Hide navbar and footer for login and signup routes
  const hideNavFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavFooter && <Navbar />}
      
      {/* Main content area grows to push footer to bottom */}
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/profile' element={<MyProfile />} />
          <Route path='/wishlist' element={<WishlistPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/my-order' element={<Myorder />} />
          <Route path='/collections' element={<CollectionPage />} />
          <Route path="/saree/:id" element={<SareeDetails />} />
          <Route path="/:slug/:id" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<SubCategoryPage />} />
          <Route path="/subcategory/:subcategoryId" element={<SubcategoryProductsPage />} />
          <Route path="/collection/:type" element={<NewCollection />} />
          <Route path="/contact" element={<Contact />} />


          <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/sliders" element={<AdminRoute><AdminSliderPage /></AdminRoute>} />
        </Routes>
      </main>

      {!hideNavFooter && <Footer />}
      <Toaster />
    </div>
  );
};

export default App;
