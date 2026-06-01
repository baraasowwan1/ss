import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, ArrowLeft, ExternalLink, ShieldAlert, Sparkles, CreditCard } from 'lucide-react';
import LiveStore from './LiveStore';

export default function Simulator({ store, setView, onBackToPlatform }) {
  const [viewport, setViewport] = useState('desktop'); // desktop, tablet, mobile

  if (!store) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#090a0f', height: '100vh', color: '#fff' }}>
        <h3>Simulator configuration empty.</h3>
        <button onClick={onBackToPlatform} className="btn btn-secondary" style={{ marginTop: '20px' }}>
          Back to SaaS
        </button>
      </div>
    );
  }

  return (
    <div className="simulator-container">
      
      {/* 1. Simulator Header Toolbar */}
      <div className="simulator-toolbar">
        {/* Left Side: Return & Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={onBackToPlatform}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ArrowLeft size={14} /> Back to SaaS
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {store.name} 
              <span style={{ fontSize: '0.7rem', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                {store.niche}
              </span>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
              URL: {store.subdomain}.sowwan.app
            </span>
          </div>
        </div>

        {/* Center: Device Switchers */}
        <div className="simulator-viewport-toggle">
          <button 
            onClick={() => setViewport('desktop')}
            className={`simulator-toggle-btn ${viewport === 'desktop' ? 'active' : ''}`}
            title="Desktop Mode"
          >
            <Monitor size={14} /> Desktop
          </button>
          
          <button 
            onClick={() => setViewport('tablet')}
            className={`simulator-toggle-btn ${viewport === 'tablet' ? 'active' : ''}`}
            title="Tablet Mode"
          >
            <Tablet size={14} /> Tablet
          </button>
          
          <button 
            onClick={() => setViewport('mobile')}
            className={`simulator-toggle-btn ${viewport === 'mobile' ? 'active' : ''}`}
            title="Mobile Mode"
          >
            <Smartphone size={14} /> Mobile
          </button>
        </div>

        {/* Right Side: Manage Store Sub / Billing */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setView('client-portal')}
            className="btn btn-secondary"
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.8rem',
              borderColor: 'var(--secondary)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CreditCard size={14} />
            Manage Billing & Catalog
          </button>
        </div>

      </div>

      {/* 2. Simulator Frame viewport */}
      <div className="simulator-frame-wrapper">
        <div className={`simulator-frame ${viewport}`}>
          
          {/* Inner viewport displaying the generated store */}
          <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <LiveStore 
              store={store} 
              isSimulatedView={true}
              onBackToPlatform={() => setView('client-portal')}
            />
          </div>

        </div>
      </div>

    </div>
  );
}
