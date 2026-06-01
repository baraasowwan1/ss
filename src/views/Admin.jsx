import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, Users, AlertOctagon, DollarSign, Search, RefreshCw, Eye, Play, Pause, Trash2, List } from 'lucide-react';
import { getStores, getTransactions, getAnalytics, updateStoreSubscriptionStatus, deleteStore } from '../utils/database';

export default function Admin({ setView, onSelectStore }) {
  const [stores, setStores] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load and refresh administrative stats
  useEffect(() => {
    setStores(getStores());
    setTransactions(getTransactions());
    setAnalytics(getAnalytics());
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleToggleStatus = (storeId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateStoreSubscriptionStatus(storeId, nextStatus);
    handleRefresh();
  };

  const handleDeleteStore = (storeId) => {
    if (window.confirm('Are you absolutely sure you want to terminate this subscription and delete the website? This action is irreversible.')) {
      deleteStore(storeId);
      handleRefresh();
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '20px' }}>
      
      {/* 1. Admin Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(181, 95, 230, 0.15)',
            border: '1px solid var(--secondary)',
            color: 'var(--secondary)',
            padding: '10px',
            borderRadius: '10px',
            display: 'flex'
          }}>
            <Shield size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', color: '#fff' }}>SOWWAN Subscription Control Panel</h2>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem' }}>
              Monitor system health, toggle active user sites, review PayPal subscriptions, and analyze transaction records.
            </p>
          </div>
        </div>

        <button 
          onClick={handleRefresh}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} /> Refresh Logs
        </button>
      </div>

      {/* 2. Analytical Metric Cards */}
      <div className="grid-4" style={{ gap: '20px', marginBottom: '32px' }}>
        
        {/* MRR */}
        <div className="glass-panel" style={{ padding: '20px', background: 'hsla(var(--bg-surface-glass) / 0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Recurring (MRR)</span>
            <TrendingUp size={18} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', fontWeight: 800, color: '#fff' }}>
            ${analytics.mrr || 0}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--emerald)', fontWeight: 600 }}>Active contract volume</span>
        </div>

        {/* Active Stores */}
        <div className="glass-panel" style={{ padding: '20px', background: 'hsla(var(--bg-surface-glass) / 0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>Active Websites</span>
            <Users size={18} color="var(--emerald)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', fontWeight: 800, color: '#fff' }}>
            {analytics.activeStoresCount || 0}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Serving traffic securely</span>
        </div>

        {/* Suspended Stores */}
        <div className="glass-panel" style={{ padding: '20px', background: 'hsla(var(--bg-surface-glass) / 0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>Suspended Accounts</span>
            <AlertOctagon size={18} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', fontWeight: 800, color: '#fff' }}>
            {analytics.suspendedStoresCount || 0}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>Paused billing operations</span>
        </div>

        {/* Total Revenue */}
        <div className="glass-panel" style={{ padding: '20px', background: 'hsla(var(--bg-surface-glass) / 0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>Total Processing Ledger</span>
            <DollarSign size={18} color="var(--gold)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', fontWeight: 800, color: '#fff' }}>
            ${analytics.totalRevenue || 0}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600 }}>PayPal validated total</span>
        </div>

      </div>

      {/* 3. Subscription Management Database Table */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        
        {/* Table Header Filter controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', color: '#fff' }}>Client Subscriptions</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Search size={16} color="hsl(var(--text-muted))" style={{ position: 'absolute', left: '12px' }} />
            <input 
              type="text" 
              className="form-input" 
              style={{ width: '280px', paddingLeft: '36px', height: '36px', fontSize: '0.85rem', borderRadius: '4px' }}
              placeholder="Search by client, domain, store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Subscriber Details</th>
                <th>Subdomain URL</th>
                <th>Contract Plan</th>
                <th>Status</th>
                <th>Total Earnings</th>
                <th style={{ textAlign: 'right' }}>Subscription Toggles</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'hsl(var(--text-muted))' }}>
                    No client subscriptions found matching search parameters.
                  </td>
                </tr>
              ) : (
                filteredStores.map((store) => (
                  <tr key={store.id}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 700, display: 'block' }}>{store.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Owner: {store.clientName} ({store.clientEmail})</span>
                      </div>
                    </td>
                    <td>
                      <span 
                        onClick={() => onSelectStore(store.subdomain)} 
                        style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {store.subdomain}.sowwan.app
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.85rem' }}>
                        {store.plan}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${store.status === 'active' ? 'badge-active' : 'badge-suspended'}`}>
                        {store.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--emerald)', fontSize: '0.9rem' }}>
                        ${(store.earnings || 0).toFixed(2)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        {/* Open simulator */}
                        <button 
                          onClick={() => onSelectStore(store.subdomain)}
                          className="btn btn-secondary" 
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }} 
                          title="Open Store View"
                        >
                          <Eye size={12} />
                        </button>
                        
                        {/* Toggle Suspend / Resume */}
                        <button 
                          onClick={() => handleToggleStatus(store.id, store.status)}
                          className="btn" 
                          style={{ 
                            padding: '6px 10px', 
                            fontSize: '0.75rem',
                            background: store.status === 'active' ? 'hsla(340, 95%, 45%, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                            color: store.status === 'active' ? 'var(--accent)' : 'var(--emerald)',
                            border: store.status === 'active' ? '1px solid hsla(340, 95%, 55%, 0.2)' : '1px solid rgba(52, 211, 153, 0.2)'
                          }} 
                          title={store.status === 'active' ? 'Pause Subscription' : 'Resume Subscription'}
                        >
                          {store.status === 'active' ? <Pause size={12} /> : <Play size={12} />}
                        </button>

                        {/* Terminate Account */}
                        <button 
                          onClick={() => handleDeleteStore(store.id)}
                          className="btn btn-danger" 
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }} 
                          title="Terminate Contract"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. PayPal Subscription Real-Time Transaction Logs */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <List size={18} color="var(--gold)" />
          Recent PayPal Billing Ledger
        </h3>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ledger ID</th>
                <th>Subscriber Reference</th>
                <th>Plan Detail</th>
                <th>Amount Charged</th>
                <th>PayPal Transaction ID</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'hsl(var(--text-muted))' }}>
                    No payment logs recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map(txn => (
                  <tr key={txn.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem' }}>{txn.id}</td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600, display: 'block' }}>{txn.storeName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{txn.clientName}</span>
                      </div>
                    </td>
                    <td style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{txn.plan}</td>
                    <td style={{ color: 'var(--emerald)', fontWeight: 700 }}>${txn.amount.toFixed(2)}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{txn.paypalTxnId}</td>
                    <td style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                      {new Date(txn.date).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
