import React, { useState } from 'react';
import { DollarSign, Check, Info } from 'lucide-react';
import { PLANS } from '../utils/database';

export default function Calculator({ onSelectPlan }) {
  const [pagesCount, setPagesCount] = useState(3);
  const [hasCatalog, setHasCatalog] = useState(false);
  const [hasDomain, setHasDomain] = useState(false);
  const [salesVolume, setSalesVolume] = useState(15);
  const [avgProductPrice, setAvgProductPrice] = useState(50);

  // Dynamic plan evaluation
  const getRecommendedPlan = () => {
    if (pagesCount > 5 || hasDomain || salesVolume > 100) return 'enterprise';
    if (pagesCount > 3 || hasCatalog || salesVolume > 15) return 'professional';
    return 'starter';
  };

  const recommendedPlanId = getRecommendedPlan();
  const planInfo = PLANS[recommendedPlanId];
  
  // Calculations
  const calculatedEarnings = salesVolume * avgProductPrice;
  const planCost = planInfo.price;
  const netEarnings = Math.max(0, calculatedEarnings - planCost);

  return (
    <div className="glass-panel" style={{
      padding: '32px',
      margin: '40px 0',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid hsla(var(--primary-hsl) / 0.15)',
      background: 'linear-gradient(180deg, hsla(var(--bg-surface-glass) / 0.9) 0%, hsla(var(--bg-dark) / 0.9) 100%)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', color: '#fff', marginBottom: '8px' }}>
          Interactive Store & Earnings Calculator
        </h3>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Customize your pages, toggle essential features, and simulate your monthly sales to discover the most profitable setup.
        </p>
      </div>

      <div className="grid-2" style={{ gap: '32px' }}>
        {/* Sliders and Feature Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h4 style={{ color: 'var(--primary)', fontFamily: 'Outfit', fontSize: '1.1rem', borderBottom: '1px solid hsla(var(--text-primary) / 0.08)', paddingBottom: '8px' }}>
            1. Configure Your Website Needs
          </h4>
          
          {/* Pages count */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="form-label">Total Custom Pages</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{pagesCount} Pages</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={pagesCount} 
              onChange={(e) => setPagesCount(parseInt(e.target.value))} 
              style={{
                width: '100%',
                height: '6px',
                background: 'hsla(var(--text-primary) / 0.1)',
                borderRadius: '3px',
                accentColor: 'var(--primary)',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '4px', display: 'block' }}>
              Starter: up to 3 pages | Pro: up to 6 pages | Enterprise: Unlimited
            </span>
          </div>

          {/* Core Feature Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="form-checkbox">
              <input 
                type="checkbox" 
                checked={hasCatalog} 
                onChange={(e) => setHasCatalog(e.target.checked)} 
              />
              <div>
                <span style={{ display: 'block', fontWeight: 600, color: '#fff' }}>E-Commerce Product Catalog</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Allows you to post and sell physical or digital goods</span>
              </div>
            </label>

            <label className="form-checkbox">
              <input 
                type="checkbox" 
                checked={hasDomain} 
                onChange={(e) => setHasDomain(e.target.checked)} 
              />
              <div>
                <span style={{ display: 'block', fontWeight: 600, color: '#fff' }}>Custom Brand Domain mapping</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Link your own .com / .net domain easily</span>
              </div>
            </label>
          </div>

          <h4 style={{ color: 'var(--secondary)', fontFamily: 'Outfit', fontSize: '1.1rem', borderBottom: '1px solid hsla(var(--text-primary) / 0.08)', paddingBottom: '8px', marginTop: '12px' }}>
            2. Simulate Your Store Sales
          </h4>

          {/* Sales Volume Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="form-label">Estimated Monthly Sales</span>
              <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{salesVolume} Items</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="250" 
              value={salesVolume} 
              onChange={(e) => setSalesVolume(parseInt(e.target.value))} 
              style={{
                width: '100%',
                height: '6px',
                background: 'hsla(var(--text-primary) / 0.1)',
                borderRadius: '3px',
                accentColor: 'var(--secondary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Product Price Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="form-label">Average Item Price</span>
              <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>${avgProductPrice}</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="500" 
              value={avgProductPrice} 
              onChange={(e) => setAvgProductPrice(parseInt(e.target.value))} 
              style={{
                width: '100%',
                height: '6px',
                background: 'hsla(var(--text-primary) / 0.1)',
                borderRadius: '3px',
                accentColor: 'var(--secondary)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Dynamic Recommendation Panel */}
        <div className="glass-panel" style={{
          padding: '24px',
          background: 'hsla(var(--bg-surface) / 0.7)',
          border: '1px solid hsla(var(--text-primary) / 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{
                background: 'rgba(0, 240, 255, 0.1)',
                color: 'var(--primary)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Recommended Setup
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>${planCost}</span>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>/month</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#fff' }}>
              {planInfo.name} Plan
            </h3>
            
            {/* Features checkmarks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {planInfo.features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', borderRadius: '50%', width: '18px', height: '18px' }}>
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span style={{ color: 'hsl(var(--text-secondary))' }}>{feature}</span>
                </div>
              ))}
            </div>

            {/* Earnings Projection */}
            <div style={{
              background: 'hsla(var(--bg-deep) / 0.6)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              border: '1px dashed hsla(var(--secondary-hsl) / 0.2)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'hsl(var(--text-muted))' }}>Simulated Monthly Sales:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>${calculatedEarnings.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'hsl(var(--text-muted))' }}>SOWWAN Subscription Cost:</span>
                <span style={{ color: '#ff4444', fontWeight: 600 }}>-${planCost.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid hsla(var(--text-primary) / 0.08)', paddingTop: '8px' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Net Monthly Profit:</span>
                <span style={{ color: 'var(--emerald)', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
                  <DollarSign size={16} />
                  {netEarnings.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onSelectPlan(recommendedPlanId)}
            className="btn btn-primary"
            style={{ width: '100%', py: '14px', borderRadius: 'var(--radius-sm)' }}
          >
            Launch with {planInfo.name} Plan
          </button>
        </div>
      </div>
    </div>
  );
}
