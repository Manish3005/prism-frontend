import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AmazonHeader from './components/AmazonHeader';
import AmazonFooter from './components/AmazonFooter';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import SupplierDashboard from './pages/vendor/SupplierDashboard';
import Marketplace from './pages/Marketplace';
import PreventionAlert from './pages/PreventionAlert';
import RenewedDetail from './pages/RenewedDetail';
import AmazonAdminDashboard from "./pages/AmazonAdminDashboard";
import CameraInspection from "./pages/CameraInspection";
import SignupPage from "./pages/SignupPage";

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const { pathname } = useLocation();
  const isAuthPage =
  pathname === "/" ||
  pathname === "/login" ||
  pathname === "/signup";

  const hideHeader =
  pathname === '/supplier' ||
  pathname === '/amazon-admin';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && !hideHeader && (
      <AmazonHeader
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={setSearchQuery}
    />
    )}
      <main className="flex-1">
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage searchQuery={searchQuery} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/renewed/:id" element={<RenewedDetail />} />
          <Route path="/supplier" element={<SupplierDashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/checkout-nudge" element={<PreventionAlert />} />
          <Route path="/amazon-admin" element={<AmazonAdminDashboard />} />
          <Route path="/camera-inspection" element={<CameraInspection />} />
        </Routes>
      </main>
      {!isAuthPage && <AmazonFooter />}
    </div>
  );
}