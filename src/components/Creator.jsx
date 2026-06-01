import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Plus, Trash2, DollarSign } from 'lucide-react';
import { PLANS, saveStore, addTransaction, getStoreBySubdomain } from '../utils/database';

export default function Creator({ selectedPlan, setView, onSelectStore }) {
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [niche, setNiche] = useState('E-commerce');
  const [theme, setTheme] = useState('cyberpunk-blue');
  const [selectedPages, setSelectedPages] = useState(['home', 'store', 'about', 'contact']);
  const [products, setProducts] = useState([]);
  
  // Custom Product Inputs
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500');

  // Checkout States
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [subdomainError, setSubdomainError] = useState('');

  const planCost = PLANS[selectedPlan]?.price || 19;
  const planInfo = PLANS[selectedPlan];

  // Pre-populate products based on niche selection to save user effort
  useEffect(() => {
    if (niche === 'E-commerce') {
      setProducts([
        { id: 1, name: 'Premium Backpack', price: 79.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', description: 'Heavy duty, water-resistant canvas' },
        { id: 2, name: 'Minimalist Wristwatch', price: 149.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', description: 'Japanese movement, leather band' }
      ]);
    } else if (niche === 'Restaurant') {
      setProducts([
        { id: 1, name: 'Truffle Mushroom Burger', price: 18.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', description: 'Angus beef, fresh truffles, swiss cheese' },
        { id: 2, name: 'Artisanal Woodfired Pizza', price: 21.00, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', description: 'San Marzano tomatoes, buffalo mozzarella' }
      ]);
    } else {
      setProducts([
        { id: 1, name: 'Consulting Consultation (1h)', price: 95.00, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500', description: 'One-on-one business strategy session' }
      ]);
    }
  }, [niche]);

  const handleSubdomainChange = (val) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(formatted);
    setSubdomainError('');
  };

  const handleAddProduct = () => {
    if (!prodName || !prodPrice) return;
    const newProduct = {
      id: Date.now(),
      name: prodName,
      price: parseFloat(prodPrice),
      description: prodDesc || 'Premium high-quality items',
      image: prodImage
    };
    setProducts([...products, newProduct]);
    setProdName('');
    setProdPrice('');
    setProdDesc('');
  };

  const handleRemoveProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const togglePage = (pageKey) => {
    if (pageKey === 'home') return; // Home page is required
    if (selectedPages.includes(pageKey)) {
      setSelectedPages(selectedPages.filter(p => p !== pageKey));
    } else {
      setSelectedPages([...selectedPages, pageKey]);
    }
  };

  const validateSubdomain = () => {
    if (!storeName.trim()) {
      setSubdomainError('Please provide a name for your store.');
      return false;
    }
    if (!subdomain.trim() || subdomain.length < 3) {
      setSubdomainError('Subdomain must be at least 3 characters long.');
      return false;
    }
    const existing = getStoreBySubdomain(subdomain);
    if (existing) {
      setSubdomainError('This subdomain is already taken. Try another name!');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!validateSubdomain()) return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // PayPal subscription simulator
  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedStoreId = 'store-' + Math.random().toString(36).substr(2, 9);
      const paypalTxnId = 'PAY-' + Math.random().toString(36).substr(2, 17).toUpperCase();
      
      const newStore = {
        id: generatedStoreId,
        name: storeName,
        subdomain: subdomain,
        niche: niche,
        theme: theme,
        pages: selectedPages,
        products: products,
        status: 'active',
        plan: selectedPlan,
        clientName: 'Demo Client',
        clientEmail: 'client@example.com',
        earnings: 0
      };

      const newTxn = {
        storeId: generatedStoreId,
        storeName: storeName,
        clientName: 'Demo Client',
        amount: planCost,
        plan: selectedPlan,
        paypalTxnId: paypalTxnId
      };

      // Save to localStorage
      saveStore(newStore);
      addTransaction(newTxn);

      setIsProcessing(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        onSelectStore(subdomain);
      }, 2500);
    }, 2000);
  };

  // Optional: Load actual PayPal SDK button inside useEffect
  useEffect(() => {
    if (step === 5) {
      // Create empty div target for script button if not rendered
      const btnContainer = document.getElementById('paypal-button-container');
      if (btnContainer && window.paypal) {
        // Render if SDK exists
        btnContainer.innerHTML = '';
        window.paypal.Buttons({
          createSubscription: function(data, actions) {
            return actions.subscription.create({
              'plan_id': 'P-XX123456789' // Mock/sandbox plan id
            });
          },
          onApprove: function(data, actions) {
            handleSimulatePayment();
          }
        }).render('#paypal-button-container');
      }
    }
  }, [step]);

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '40px 16px' }}>
      
      {/* Wizard Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'hsla(var(--text-primary) / 0.1)', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, width: `${((step - 1) / 4) * 100}%`, height: '2px', background: 'var(--primary)', zIndex: 2, transition: 'width 0.3s ease' }} />
        
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: step >= s ? 'var(--primary)' : 'hsl(var(--bg-surface))',
            color: step >= s ? 'hsl(var(--bg-deep))' : 'hsl(var(--text-muted))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            zIndex: 3,
            border: step >= s ? '3px solid var(--primary-glow)' : '1px solid hsla(var(--text-primary) / 0.1)',
            transition: 'all 0.3s ease'
          }}>
            {step > s ? <Check size={16} strokeWidth={3} /> : s}
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '32px', background: 'var(--bg-surface-glass)' }}>
        
        {/* STEP 1: Basic Identity */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Sparkles size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Step 1: Website Name & Niche</h2>
            </div>
            
            <div className="form-group">
              <label className="form-label">Store / Website Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Ahmad Tech Spot"
                value={storeName}
                onChange={(e) => {
                  setStoreName(e.target.value);
                  if (!subdomain) handleSubdomainChange(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subdomain Name</label>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingRight: '120px' }}
                  placeholder="ahmadtech"
                  value={subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                />
                <span style={{
                  position: 'absolute',
                  right: '16px',
                  color: 'hsl(var(--text-muted))',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  .sowwan.app
                </span>
              </div>
              {subdomainError && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '6px', display: 'block' }}>
                  {subdomainError}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Industry / Niche</label>
              <div className="grid-3" style={{ gap: '12px' }}>
                {['E-commerce', 'Restaurant', 'Portfolio'].map((opt) => (
                  <div 
                    key={opt}
                    onClick={() => setNiche(opt)}
                    className="glass-panel"
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderWidth: '2px',
                      borderColor: niche === opt ? 'var(--primary)' : 'transparent',
                      background: niche === opt ? 'hsla(var(--primary-hsl) / 0.05)' : 'hsla(var(--bg-surface) / 0.6)'
                    }}
                  >
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: niche === opt ? '#fff' : 'hsl(var(--text-secondary))' }}>
                      {opt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Theme Selector */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Sparkles size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Step 2: Choose Design Theme</h2>
            </div>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem', marginBottom: '20px' }}>
              Select a visual color preset that reflects your brand. You can customize products and themes later.
            </p>

            <div className="grid-2" style={{ gap: '16px' }}>
              {[
                { id: 'cyberpunk-blue', name: 'Cyberpunk Neon', class: 'theme-cyberpunk-blue', desc: 'Glowing cyan buttons, glass background, sleek tech look.' },
                { id: 'sunset-gold', name: 'Sunset Premium Gold', class: 'theme-sunset-gold', desc: 'Luxury amber tones, deep warm surfaces, ideal for high-end boutique.' },
                { id: 'emerald-glass', name: 'Emerald Forest Glass', class: 'theme-emerald-glass', desc: 'Organic mint tones, soft green accents, perfect for health or vegan store.' },
                { id: 'deep-amethyst', name: 'Deep Amethyst', class: 'theme-deep-amethyst', desc: 'Mystic royal purple gradients, futuristic and creative agency styling.' }
              ].map((t) => (
                <div 
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`theme-preview ${t.class} ${theme === t.id ? 'active' : ''}`}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>{t.name}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t.desc}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--theme-accent, #00f0ff)' }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fff' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Page Selection */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Sparkles size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Step 3: Add Custom Pages</h2>
            </div>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem', marginBottom: '20px' }}>
              Configure your site menu. Selected pages will be dynamically compiled with beautiful sections.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'home', name: 'Home Landing Page', desc: 'Stunning header, features grid, product showcase, and email form.', required: true },
                { id: 'store', name: 'Shopping Catalog Page', desc: 'Displays products with quick cart additions and dynamic checkouts.', required: false },
                { id: 'about', name: 'About Us Biography', desc: 'Custom brand story, team vision statement, and corporate core values.', required: false },
                { id: 'faq', name: 'Frequently Asked Questions (FAQ)', desc: 'Interactive accordion panel loaded with popular Q&A responses.', required: false },
                { id: 'contact', name: 'Contact Info & Map', desc: 'Secure message form, email, active social media, and location details.', required: false }
              ].map((p) => (
                <div 
                  key={p.id}
                  onClick={() => !p.required && togglePage(p.id)}
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: p.required ? 'not-allowed' : 'pointer',
                    borderColor: selectedPages.includes(p.id) ? 'var(--primary)' : 'hsla(var(--text-primary) / 0.08)',
                    background: selectedPages.includes(p.id) ? 'hsla(var(--primary-hsl) / 0.03)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedPages.includes(p.id)}
                      disabled={p.required}
                      onChange={() => {}}
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                    />
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', display: 'block' }}>
                        {p.name} {p.required && <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>(Required)</span>}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{p.desc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Product Catalog setup */}
        {step === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Sparkles size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Step 4: Product Catalog</h2>
            </div>
            
            {/* Products List */}
            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', paddingRight: '8px' }}>
              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>
                  No products in catalog. Add your first item below!
                </div>
              ) : (
                products.map((p) => (
                  <div key={p.id} className="glass-panel" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'hsla(var(--bg-surface) / 0.4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', display: 'block' }}>{p.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--emerald)', fontWeight: 700 }}>${p.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveProduct(p.id)} className="btn btn-danger" style={{ padding: '6px', borderRadius: '4px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Product Adder Form */}
            <div className="glass-panel" style={{ padding: '16px', background: 'hsla(var(--bg-deep) / 0.5)', border: '1px dashed hsla(var(--text-primary) / 0.1)' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', display: 'block', marginBottom: '12px' }}>
                Add New Product / Service
              </span>
              <div className="grid-2" style={{ gap: '12px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Item Name (e.g. Wireless Charger)"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', color: 'var(--emerald)', fontWeight: 600 }}>$</span>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ paddingLeft: '24px' }}
                    placeholder="Price (e.g. 29.99)"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group" style={{ marginTop: '12px', marginBottom: 0 }}>
                <textarea 
                  className="form-input" 
                  placeholder="Brief item description..."
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  style={{ resize: 'none', fontSize: '0.85rem' }}
                />
              </div>

              <button 
                onClick={handleAddProduct}
                className="btn btn-secondary" 
                style={{ width: '100%', marginTop: '12px', padding: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Plus size={14} />
                Add Product to Catalog
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PayPal Subscription Payment */}
        {step === 5 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Sparkles size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Step 5: Review & Checkout</h2>
            </div>

            {isProcessing ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="spin-slow" style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '4px solid hsla(var(--primary-hsl) / 0.1)',
                  borderTopColor: 'var(--primary)',
                  margin: '0 auto 24px auto',
                  animationName: 'spin-slow',
                  animationDuration: '1.5s'
                }} />
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Processing PayPal Subscription...</h3>
                <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem' }}>Communicating with PayPal gateway. Do not reload page.</p>
              </div>
            ) : paymentSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(52, 211, 153, 0.15)',
                  color: 'var(--emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  border: '2px solid var(--emerald)'
                }}>
                  <Check size={32} strokeWidth={3} />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>Subscription Verified!</h3>
                <p style={{ color: 'var(--emerald)', fontSize: '0.9rem', fontWeight: 600 }}>Your custom store is being provisioned...</p>
                <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.8rem', marginTop: '8px' }}>Redirecting to your active store simulator...</p>
              </div>
            ) : (
              <div>
                {/* Invoice Breakdown */}
                <div className="glass-panel" style={{ padding: '20px', background: 'hsla(var(--bg-deep) / 0.6)', border: '1px solid hsla(var(--text-primary) / 0.05)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>SOWWAN Plan Type:</span>
                    <span style={{ color: '#fff', fontWeight: 700, textTransform: 'capitalize' }}>{selectedPlan} Plan</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Store Host Domain:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{subdomain}.sowwan.app</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Configured Niche & Theme:</span>
                    <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{niche} ({theme})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid hsla(var(--text-primary) / 0.08)', paddingTop: '12px' }}>
                    <span style={{ color: '#fff', fontWeight: 700 }}>Due Today (Monthly Recurring):</span>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>${planCost}.00 / month</span>
                  </div>
                </div>

                {/* PayPal checkout container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* PayPal Sandbox placeholder target */}
                  <div id="paypal-button-container" style={{ minHeight: '40px' }} />

                  {/* Fallback Simulator Quick Action Button */}
                  <button 
                    onClick={handleSimulatePayment}
                    className="btn btn-gold"
                    style={{
                      width: '100%',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      fontSize: '0.95rem'
                    }}
                  >
                    <DollarSign size={16} />
                    Simulate Quick PayPal Subscription
                  </button>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textAlign: 'center', display: 'block' }}>
                    * Recommended for instant local testing. Simulates immediate secure subscription authorization.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        {!paymentSuccess && !isProcessing && (
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid hsla(var(--text-primary) / 0.08)', paddingTop: '20px', marginTop: '32px' }}>
            {step > 1 ? (
              <button onClick={handlePrevStep} className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <button onClick={() => setView('landing')} className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Cancel
              </button>
            )}

            {step < 5 ? (
              <button onClick={handleNextStep} className="btn btn-primary" style={{ padding: '8px 24px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Next <ArrowRight size={14} />
              </button>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}
