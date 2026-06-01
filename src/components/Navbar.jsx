import React, { useState } from 'react';
import { Layers, Shield, Sparkles, ChevronDown, Monitor } from 'lucide-react';
import { getStores } from '../utils/database';

export default function Navbar({ currentView, setView, onSelectStore }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const stores = getStores();

  const handleStoreSelect = (store) => {
    onSelectStore(store.subdomain);
    setDropdownOpen(false);
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      margin: '12px 24px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid hsla(var(--text-primary) / 0.08)',
      background: 'hsla(var(--bg-surface-glass) / 0.8)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        padding: '0 16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setView('landing')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer' 
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--primary-glow)'
          }}>
            <Layers size={18} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ 
            fontFamily: 'Outfit', 
            fontSize: '1.4rem', 
            fontWeight: 800, 
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #fff 50%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            SOWWAN
          </span>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => setView('landing')} 
            className="btn"
            style={{ 
              background: 'transparent', 
              color: currentView === 'landing' ? 'var(--primary)' : 'hsl(var(--text-secondary))',
              padding: '6px 12px',
              fontSize: '0.9rem'
            }}
          >
            Home
          </button>
          
          <button 
            onClick={() => setView('creator')} 
            className="btn btn-secondary"
            style={{ 
              padding: '8px 16px',
              fontSize: '0.85rem',
              borderColor: currentView === 'creator' ? 'var(--primary)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} color="var(--primary)" />
            Build Website
          </button>

          {/* Quick Store Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="btn btn-secondary"
              style={{ 
                padding: '8px 16px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: dropdownOpen ? 'var(--secondary)' : 'transparent'
              }}
            >
              <Monitor size={14} color="var(--secondary)" />
              Demo Stores
              <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {dropdownOpen && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                padding: '8px',
                background: 'hsl(var(--bg-surface))',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid hsla(var(--text-primary) / 0.1)',
                zIndex: 200
              }}>
                <div style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live Client Sites
                </div>
                {stores.map(store => (
                  <div 
                    key={store.id} 
                    onClick={() => handleStoreSelect(store)} 
                    style={{
                      padding: '10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      transition: 'background 0.2s',
                      marginTop: '4px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'hsla(var(--text-primary) / 0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{store.name}</span>
                      <span className={`badge ${store.status === 'active' ? 'badge-active' : 'badge-suspended'}`} style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                        {store.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>{store.subdomain}.sowwan.app</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Control Dashboard */}
          <button 
            onClick={() => setView('admin')} 
            className="btn"
            style={{ 
              background: currentView === 'admin' ? 'hsla(var(--secondary-hsl) / 0.15)' : 'transparent', 
              color: currentView === 'admin' ? 'var(--secondary)' : 'hsl(var(--text-secondary))',
              border: currentView === 'admin' ? '1px solid var(--secondary)' : '1px solid transparent',
              padding: '8px 16px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Shield size={14} />
            Admin Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
}
