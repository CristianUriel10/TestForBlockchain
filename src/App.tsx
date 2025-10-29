import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { WalletModal } from './components/WalletModal/WalletModal';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardPage } from './pages/DashboardPage';
import { useWallet } from './hooks/useWallet';

const AppContent: React.FC = () => {
  const [favorites, setFavorites] = useState(['1', '4']);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use the real wallet hook
  const {
    isConnected: walletConnected,
    address: walletAddress,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isMetaMaskInstalled,
  } = useWallet();

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleCloseWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  const handleWalletConnect = async () => {
    await connectWallet();
    // Close modal after successful connection
    if (!error) {
      setTimeout(() => {
        setIsWalletModalOpen(false);
      }, 2000); // Show success state for 2 seconds
    }
  };

  const handleWalletDisconnect = () => {
    disconnectWallet();
    setIsWalletModalOpen(false);
  };

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <Navbar 
        onConnectWallet={handleConnectWallet}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        formatAddress={formatAddress}
      />
      
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={handleCloseWalletModal}
        walletState={{
          isConnected: walletConnected,
          address: walletAddress,
          isConnecting,
          error,
        }}
        onConnectWallet={handleWalletConnect}
        onDisconnectWallet={handleWalletDisconnect}
        isMetaMaskInstalled={isMetaMaskInstalled}
        formatAddress={formatAddress}
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/listings" 
          element={
            <ListingsPage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/property/:id" 
          element={<PropertyDetailPage onToggleFavorite={handleToggleFavorite} />} 
        />
        <Route 
          path="/favorites" 
          element={
            <FavoritesPage 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <DashboardPage 
              walletConnected={walletConnected}
              onConnectWallet={handleConnectWallet}
              walletAddress={walletAddress}
              onDisconnectWallet={handleWalletDisconnect}
              formatAddress={formatAddress}
            />
          } 
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;