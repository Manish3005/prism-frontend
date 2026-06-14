import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AmazonHeader from './components/AmazonHeader';
import AmazonFooter from './components/AmazonFooter';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import SupplierDashboard from './pages/SupplierDashboard';
import Marketplace from './pages/Marketplace';
import PreventionAlert from './pages/PreventionAlert';
import RenewedDetail from './pages/RenewedDetail';
import AmazonAdminDashboard from "./pages/AmazonAdminDashboard";
import CameraInspection from "./pages/CameraInspection";

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <AmazonHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={setSearchQuery}
      />
      <main className="flex-1">
        <Routes>
        <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/renewed/:id" element={<RenewedDetail />} />
        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/checkout-nudge" element={<PreventionAlert />} />
        <Route path="/amazon-admin" element={<AmazonAdminDashboard />} />
        <Route path="/camera-inspection" element={<CameraInspection />} />
        </Routes>
      </main>
      <AmazonFooter />
    </div>
  );
}
