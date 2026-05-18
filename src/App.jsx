import { Routes, Route } from 'react-router-dom';
import Nav from './components/navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { useCart } from './context/CartContext.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import RentalsPage from './pages/RentalsPage.jsx';
import SalesPage from './pages/SalesPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminProductsPage from './pages/Admin/AdminProductsPage.jsx';
import AdminInvoicePage from './pages/Admin/AdminInvoicePage.jsx';

function App() {
  const { cartOpen, closeCart } = useCart();

  return (
    <>
      <Nav />
      <CartDrawer open={cartOpen} onClose={closeCart} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/rentals/:id" element={<ProductDetailPage type="rental" />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/sales/:id" element={<ProductDetailPage type="sale" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="invoice" element={<AdminInvoicePage />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
