import React, { useState, useEffect } from 'react';
import { initializeDatabase, getStores } from './utils/database';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './views/Landing';
import Creator from './components/Creator';
import ClientHome from './views/ClientHome';
import Simulator from './components/Simulator';

export default function App() {
  const [view, setView] = useState('landing'); // landing, creator, client-portal, store-preview
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [activeStoreSubdomain, setActiveStoreSubdomain] = useState('');

  // Initializing local storage data entries on boot
  useEffect(() => {
    initializeDatabase();
    
    // Set first demo store as default active to populate client dashboard if visited
    const stores = getStores();
    if (stores.length > 0) {
      setActiveStoreSubdomain(stores[0].subdomain);
    }
  }, []);

  const handleSelectStorePreview = (subdomain) => {
    setActiveStoreSubdomain(subdomain);
    setView('store-preview');
  };

  const getActiveStore = () => {
    const stores = getStores();
    return stores.find(s => s.subdomain === activeStoreSubdomain);
  };

  // Determine layout and view to render
  const renderContent = () => {
    switch (view) {
      case 'landing':
        return <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
      case 'creator':
        return (
          <Creator 
            selectedPlan={selectedPlan} 
            setView={setView} 
            onSelectStore={handleSelectStorePreview} 
          />
        );
      case 'client-portal':
        return (
          <ClientHome 
            activeSubdomain={activeStoreSubdomain} 
            setView={setView} 
            onSelectStore={handleSelectStorePreview} 
          />
        );
      case 'store-preview':
        const activeStore = getActiveStore();
        return (
          <Simulator 
            store={activeStore} 
            setView={setView} 
            onBackToPlatform={() => {
              // Return to client dashboard or admin based on current records
              setView('client-portal');
            }} 
          />
        );
      default:
        return <Landing setView={setView} setSelectedPlan={setSelectedPlan} />;
    }
  };

  const isStorePreview = view === 'store-preview';

  return (
    <div className="app-container">
      
      {/* SaaS Global Header (Hidden when viewing site simulator) */}
      {!isStorePreview && (
        <Navbar 
          currentView={view} 
          setView={setView} 
          onSelectStore={handleSelectStorePreview} 
        />
      )}

      {/* Main Content Layout */}
      <main className="content-wrapper">
        {renderContent()}
      </main>

      {/* SaaS Global Footer (Hidden when viewing site simulator) */}
      {!isStorePreview && <Footer setView={setView} />}

    </div>
  );
}
