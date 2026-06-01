import React, { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, DollarSign, Package, CreditCard, ChevronRight, Plus, Trash2, Globe, AlertTriangle } from 'lucide-react';
import { getStores, saveStore, updateStoreSubscriptionStatus } from '../utils/database';

export default function ClientHome({ activeSubdomain, setView, onSelectStore }) {
  const [store, setStore] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, products, billing
  const [productsList, setProductsList] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form states for adding product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500');

  useEffect(() => {
    const stores = getStores();
    const activeStore = stores.find(s => s.subdomain === activeSubdomain);
    if (activeStore) {
      setStore(activeStore);
      setProductsList(activeStore.products || []);
    }
  }, [activeSubdomain, refreshTrigger]);

  if (!store) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#fff' }}>
        <h3>Active store configuration not found.</h3>
        <button onClick={() => setView('landing')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Go Home
        </button>
      </div>
    );
  }

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    
    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      description: description || 'Premium customized selection.',
      image
    };

    const updatedStore = {
      ...store,
      products: [...productsList, newProduct]
    };

    saveStore(updatedStore);
    setName('');
    setPrice('');
    setDescription('');
    handleRefresh();
  };

  const handleDeleteProduct = (productId) => {
    const updatedStore = {
      ...store,
      products: productsList.filter(p => p.id !== productId)
    };
    saveStore(updatedStore);
    handleRefresh();
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to pause your PayPal subscription? This will temporarily suspend your live store website.')) {
      updateStoreSubscriptionStatus(store.id, 'suspended');
      handleRefresh();
    }
  };

  const handleResumeSubscription = () => {
    updateStoreSubscriptionStatus(store.id, 'active');
    handleRefresh();
  };

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '20px' }}>
      
      {/* 1. Client Store Header */}
      <div className="glass-panel" style={{
        padding: '24px',
        marginBottom: '32px',
        background: 'linear-gradient(90deg, hsla(var(--bg-surface-glass) / 0.8) 0%, hsla(var(--bg-dark) / 0.8) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', color: '#fff' }}>{store.name}</h2>
              <span className={`badge ${store.status === 'active' ? 'badge-active' : 'badge-suspended'}`}>
                {store.status}
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={14} color="var(--primary)" /> URL: {store.subdomain}.sowwan.app
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => onSelectStore(store.subdomain)} 
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.85rem' }}
            >
              Open Live Simulator
            </button>
          </div>
        </div>

        {/* Tab Switchers */}
        <div style={{
          display: 'flex',
          gap: '12px',
          borderTop: '1px solid hsla(var(--text-primary) / 0.08)',
          paddingTop: '20px',
          marginTop: '20px'
        }}>
          {[
            { id: 'analytics', name: 'Sales Analytics', icon: <TrendingUp size={14} /> },
            { id: 'products', name: 'Product Catalog', icon: <Package size={14} /> },
            { id: 'billing', name: 'PayPal Billing Setting', icon: <CreditCard size={14} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                background: activeTab === tab.id ? 'hsla(var(--primary-hsl) / 0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'hsl(var(--text-muted))',
                border: activeTab === tab.id ? '1px solid var(--primary)' : '1px solid transparent'
              }}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Client Tab Views */}
      <div style={{ minHeight: '300px' }}>
        
        {/* VIEW: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <div className="grid-3" style={{ gap: '24px', marginBottom: '32px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>Gross Store Earnings</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--emerald)', fontFamily: 'Outfit', fontWeight: 800, margin: '8px 0' }}>
                  ${(store.earnings || 0).toFixed(2)}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Direct custom checkouts</span>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>Total Store Orders</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', fontFamily: 'Outfit', fontWeight: 800, margin: '8px 0' }}>
                  {Math.floor((store.earnings || 0) / 45) + (store.earnings > 0 ? 1 : 0)}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Processing smoothly</span>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>Traffic Visits</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--secondary)', fontFamily: 'Outfit', fontWeight: 800, margin: '8px 0' }}>
                  {Math.floor((store.earnings || 0) * 1.8) + 120}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Simulated real-time traffic</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <TrendingUp size={32} color="var(--primary)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '8px' }}>Store Activity Feed</h4>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto' }}>
                Your custom website is completely configured to process cart checkout events. Open your live preview simulator, add items, and checkout as a customer to see earnings update instantly.
              </p>
            </div>
          </div>
        )}

        {/* VIEW: PRODUCTS CATALOG MANAGER */}
        {activeTab === 'products' && (
          <div className="grid-2" style={{ gap: '32px' }}>
            
            {/* List existing */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'Outfit', color: '#fff', marginBottom: '16px' }}>Active Product Catalog</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {productsList.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                    Your catalog is currently empty. Use the adder panel to list items.
                  </div>
                ) : (
                  productsList.map(p => (
                    <div key={p.id} className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'hsla(var(--bg-surface) / 0.4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', display: 'block' }}>{p.name}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--emerald)', fontWeight: 700 }}>${p.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProduct(p.id)} className="btn btn-danger" style={{ padding: '8px', borderRadius: '4px' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add New Product Form */}
            <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'Outfit', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} color="var(--primary)" />
                Add Store Product
              </h3>
              
              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Product Name</label>
                  <input type="text" required className="form-input" placeholder="e.g. Leather Boots" value={name} onChange={e => setName(e.target.value)} />
                </div>
                
                <div>
                  <label className="form-label">Price (USD)</label>
                  <input type="number" required step="0.01" className="form-input" placeholder="e.g. 59.99" value={price} onChange={e => setPrice(e.target.value)} />
                </div>

                <div>
                  <label className="form-label">Product Image URL</label>
                  <input type="text" required className="form-input" value={image} onChange={e => setImage(e.target.value)} />
                </div>

                <div>
                  <label className="form-label">Item Description</label>
                  <textarea rows={3} className="form-input" placeholder="Product details..." value={description} onChange={e => setDescription(e.target.value)} style={{ resize: 'none' }} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '10px' }}>
                  List Product to Live Store
                </button>
              </form>
            </div>

          </div>
        )}

        {/* VIEW: PAYPAL BILLING SETTINGS */}
        {activeTab === 'billing' && (
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '32px', background: 'hsla(var(--bg-surface-glass) / 0.8)' }}>
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'Outfit', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color="var(--secondary)" />
                PayPal Subscription Status
              </h3>

              {store.status === 'suspended' ? (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '24px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <AlertTriangle size={24} color="var(--accent)" style={{ flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 700, color: '#fff', display: 'block', marginBottom: '4px' }}>Subscription Suspended</span>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>
                      Your website is currently offline because your subscription was paused. Click the resume button below to reactivate billing and restore your live store subdomain immediately.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(52, 211, 153, 0.1)',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '24px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <CreditCard size={24} color="var(--emerald)" style={{ flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 700, color: '#fff', display: 'block', marginBottom: '4px' }}>PayPal Subscription Active</span>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>
                      Your monthly subscription is active, and payments are being processed securely via PayPal. Your website subdomain is online and serving buyers.
                    </p>
                  </div>
                </div>
              )}

              {/* Billing Info Table */}
              <div style={{ borderBottom: '1px solid hsla(var(--text-primary) / 0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'hsl(var(--text-muted))' }}>Contract Plan Name:</span>
                  <span style={{ fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>{store.plan}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'hsl(var(--text-muted))' }}>Monthly Rate Charged:</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>${store.plan === 'starter' ? 19 : store.plan === 'professional' ? 49 : 99}.00 / month</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'hsl(var(--text-muted))' }}>Billing Gateway:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>PayPal Subscription API</span>
                </div>
              </div>

              {/* Action Toggles */}
              <div style={{ display: 'flex', gap: '16px' }}>
                {store.status === 'suspended' ? (
                  <button 
                    onClick={handleResumeSubscription}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    Resume PayPal Subscription
                  </button>
                ) : (
                  <button 
                    onClick={handleCancelSubscription}
                    className="btn btn-danger"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    Pause Subscription (Suspend Site)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
