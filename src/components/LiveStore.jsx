import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, Check, MapPin, Phone, Mail, ShoppingCart, Trash2, ArrowLeft, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { saveStore } from '../utils/database';

export default function LiveStore({ store, isSimulatedView = false, onBackToPlatform = null }) {
  const [storeView, setStoreView] = useState('home'); // home, store, about, contact, faq
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  if (!store) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#000', color: '#fff' }}>
        <h3>Store configuration not found.</h3>
      </div>
    );
  }

  // SUSPENDED STORE SCREEN
  if (store.status === 'suspended') {
    return (
      <div className={`theme-${store.theme}`} style={{
        height: '100%',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        background: 'var(--theme-bg, #090a0f)',
        color: 'var(--theme-text, #fff)',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #ef4444',
          marginBottom: '24px'
        }}>
          <AlertTriangle size={36} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
          Website Suspended
        </h2>
        <p style={{ maxWidth: '450px', color: 'var(--theme-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
          The subscription for <strong>{store.name}</strong> is currently paused or inactive. Please contact the administrator to activate your subscription and restore operations.
        </p>
        <div style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', padding: '6px 12px', background: 'var(--theme-surface)', borderRadius: '4px' }}>
          Subdomain Reference: {store.subdomain}.sowwan.app
        </div>
        {isSimulatedView && onBackToPlatform && (
          <button onClick={onBackToPlatform} className="btn btn-secondary" style={{ marginTop: '24px', padding: '8px 20px', fontSize: '0.85rem' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  // Cart operations
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    setPurchaseSuccess(true);
    
    // Simulate updating store owner earnings!
    const totalSpent = getCartTotal();
    const updatedStore = {
      ...store,
      earnings: (store.earnings || 0) + totalSpent
    };
    saveStore(updatedStore);

    setTimeout(() => {
      setCart([]);
      setPurchaseSuccess(false);
      setCartOpen(false);
    }, 3000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmittingContact(true);
    setTimeout(() => {
      setSubmittingContact(false);
      setContactSuccess(true);
      setTimeout(() => setContactSuccess(false), 3000);
    }, 1500);
  };

  // Niche specific visual banners
  const getNicheBannerUrl = () => {
    if (store.niche === 'Restaurant') {
      return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200';
    } else if (store.niche === 'Portfolio') {
      return 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200';
    }
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200';
  };

  return (
    <div className={`theme-${store.theme}`} style={{
      background: 'var(--theme-bg, #030816)',
      color: 'var(--theme-text, #fff)',
      minHeight: '100%',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      
      {/* Generated Store Navigation Bar */}
      <nav style={{
        background: 'var(--theme-surface, #071330)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setStoreView('home')}>
          <ShoppingBag size={18} color="var(--theme-accent, #00f0ff)" />
          <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em', color: '#fff' }}>{store.name}</span>
        </div>

        {/* Dynamic Nav Menu based on Pages selected in wizard */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => setStoreView('home')} 
            style={{
              background: 'transparent',
              border: 'none',
              color: storeView === 'home' ? 'var(--theme-accent, #00f0ff)' : 'var(--theme-text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Home
          </button>
          
          {store.pages.includes('store') && (
            <button 
              onClick={() => setStoreView('store')} 
              style={{
                background: 'transparent',
                border: 'none',
                color: storeView === 'store' ? 'var(--theme-accent, #00f0ff)' : 'var(--theme-text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Shop
            </button>
          )}

          {store.pages.includes('about') && (
            <button 
              onClick={() => setStoreView('about')} 
              style={{
                background: 'transparent',
                border: 'none',
                color: storeView === 'about' ? 'var(--theme-accent, #00f0ff)' : 'var(--theme-text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              About
            </button>
          )}

          {store.pages.includes('faq') && (
            <button 
              onClick={() => setStoreView('faq')} 
              style={{
                background: 'transparent',
                border: 'none',
                color: storeView === 'faq' ? 'var(--theme-accent, #00f0ff)' : 'var(--theme-text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              FAQ
            </button>
          )}

          {store.pages.includes('contact') && (
            <button 
              onClick={() => setStoreView('contact')} 
              style={{
                background: 'transparent',
                border: 'none',
                color: storeView === 'contact' ? 'var(--theme-accent, #00f0ff)' : 'var(--theme-text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Contact
            </button>
          )}

          {/* Cart Icon Toggle */}
          {store.pages.includes('store') && (
            <button 
              onClick={() => setCartOpen(true)} 
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                position: 'relative'
              }}
            >
              <ShoppingCart size={14} color="var(--theme-accent, #00f0ff)" />
              Cart
              {cart.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'var(--theme-accent, #00f0ff)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* Main Page Renderings */}
      <div style={{ flex: 1 }}>
        
        {/* VIEW: HOME LANDING */}
        {storeView === 'home' && (
          <div>
            {/* Hero Banner Section */}
            <div style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url(${getNicheBannerUrl()})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '60px 24px',
              textAlign: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>
                Welcome to {store.name}
              </h1>
              <p style={{ maxWidth: '600px', margin: '0 auto 24px auto', color: 'var(--theme-text-muted, #ccc)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Experience {store.niche} redefined. We offer hand-crafted solutions tailored perfectly for absolute quality and style. Browse our items or learn more.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                {store.pages.includes('store') && (
                  <button onClick={() => setStoreView('store')} className="btn" style={{ background: 'var(--theme-accent, #00f0ff)', color: '#000', padding: '10px 20px', fontSize: '0.85rem' }}>
                    Shop Products <ChevronRight size={14} />
                  </button>
                )}
                <button onClick={() => setStoreView(store.pages.includes('about') ? 'about' : 'contact')} className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                  Learn More
                </button>
              </div>
            </div>

            {/* Showcase items if they have products */}
            {store.pages.includes('store') && (
              <div style={{ padding: '48px 24px' }}>
                <h3 style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '32px', color: '#fff' }}>
                  Featured Catalogue Items
                </h3>
                <div className="grid-3" style={{ gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                  {store.products.slice(0, 3).map(product => (
                    <div key={product.id} style={{ background: 'var(--theme-surface, #071330)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '4px' }}>{product.name}</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)', lineHeight: 1.4, marginBottom: '16px', flex: 1 }}>{product.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--theme-accent, #00f0ff)', fontSize: '1rem' }}>${product.price.toFixed(2)}</span>
                          <button 
                            onClick={() => addToCart(product)}
                            style={{ background: 'var(--theme-accent, #00f0ff)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.75rem', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: CATALOG SHOP */}
        {storeView === 'store' && (
          <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#fff' }}>Shop Catalog</h2>
            <p style={{ color: 'var(--theme-text-muted)', fontSize: '0.85rem', marginBottom: '32px' }}>
              Explore our items. Fully responsive transactions with automated cart checkout calculations.
            </p>

            <div className="grid-3" style={{ gap: '20px' }}>
              {store.products.map(product => (
                <div key={product.id} style={{ background: 'var(--theme-surface)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '4px' }}>{product.name}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)', lineHeight: 1.4, marginBottom: '16px', flex: 1 }}>{product.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--theme-accent, #00f0ff)', fontSize: '1rem' }}>${product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        style={{ background: 'var(--theme-accent, #00f0ff)', border: 'none', color: '#000', fontWeight: 700, fontSize: '0.75rem', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: ABOUT PAGE */}
        {storeView === 'about' && (
          <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', color: '#fff' }}>About Us</h2>
            <div style={{ background: 'var(--theme-surface)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '24px', borderRadius: '8px', lineHeight: 1.6 }}>
              <h3 style={{ color: 'var(--theme-accent, #00f0ff)', fontSize: '1.1rem', marginBottom: '12px' }}>Our Brand Philosophy</h3>
              <p style={{ color: 'var(--theme-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                At {store.name}, our journey started with a single, clear objective: to bring high-quality {store.niche} products directly to our clients without compromises. We value design craftsmanship, premium materials, and responsive service above all else.
              </p>
              <p style={{ color: 'var(--theme-text-muted)', fontSize: '0.9rem' }}>
                Every single item in our catalogue is rigorously designed and vetted to ensure maximum reliability, giving you complete satisfaction with your purchases.
              </p>
            </div>
          </div>
        )}

        {/* VIEW: FAQ */}
        {storeView === 'faq' && (
          <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', color: '#fff' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { q: 'How long does shipping or delivery take?', a: 'Standard order processing takes 1-2 business days. Shipping varies between 3-7 days depending on your delivery address.' },
                { q: 'Do you offer a refund policy?', a: 'Yes! We offer a 30-day money-back guarantee on all pristine catalog products. Contact us via the contact form to initiate.' },
                { q: 'Can I request a custom order?', a: 'Absolutely. Drop us a message with specifications via our Contact portal and our designers will reply in 24 hours.' }
              ].map((faq, idx) => (
                <div key={idx} style={{ background: 'var(--theme-surface)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '8px' }}>{faq.q}</h4>
                  <p style={{ color: 'var(--theme-text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: CONTACT PAGE */}
        {storeView === 'contact' && (
          <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#fff' }}>Contact Us</h2>
            <p style={{ color: 'var(--theme-text-muted)', fontSize: '0.85rem', marginBottom: '32px' }}>
              Have questions or request customizations? Drop us a message below and we will get back to you.
            </p>

            <div className="grid-2" style={{ gap: '24px' }}>
              {/* Form */}
              <div style={{ background: 'var(--theme-surface)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '24px', borderRadius: '8px' }}>
                {contactSuccess ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--theme-accent, #00f0ff)' }}>
                    <Check size={32} style={{ margin: '0 auto 12px auto' }} />
                    <h4 style={{ color: '#fff' }}>Message Sent!</h4>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Thank you, we will contact you shortly.</span>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                      <input type="text" required style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
                      <input type="email" required style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', display: 'block', marginBottom: '4px' }}>Message</label>
                      <textarea required rows={4} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', resize: 'none' }} />
                    </div>
                    <button type="submit" disabled={submittingContact} style={{ background: 'var(--theme-accent, #00f0ff)', border: 'none', color: '#000', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      {submittingContact ? <RefreshCw size={14} className="spin-slow" /> : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--theme-surface)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                  <MapPin size={20} color="var(--theme-accent, #00f0ff)" />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block', color: '#fff', fontSize: '0.9rem' }}>Location</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)' }}>Amman, Jordan</span>
                  </div>
                </div>

                <div style={{ background: 'var(--theme-surface)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                  <Mail size={20} color="var(--theme-accent, #00f0ff)" />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block', color: '#fff', fontSize: '0.9rem' }}>Email</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)' }}>support@{store.subdomain}.sowwan.app</span>
                  </div>
                </div>

                <div style={{ background: 'var(--theme-surface)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                  <Phone size={20} color="var(--theme-accent, #00f0ff)" />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block', color: '#fff', fontSize: '0.9rem' }}>Phone</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)' }}>+962 6 555-5555</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Cart Sliding Overlay Panel */}
      {cartOpen && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '380px',
          background: 'var(--theme-bg)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} color="var(--theme-accent, #00f0ff)" />
              Customer Cart
            </span>
            <button onClick={() => setCartOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {purchaseSuccess ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.15)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', border: '1px solid var(--emerald)', marginBottom: '16px' }}>
                <Check size={24} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '8px' }}>Order Complete!</h4>
              <p style={{ color: 'var(--theme-text-muted)', fontSize: '0.8rem' }}>Simulated client catalog purchase succeeded. Store earnings updated!</p>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--theme-text-muted)', fontSize: '0.85rem' }}>
              Cart is currently empty.
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {/* Item lists */}
              <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', background: 'var(--theme-surface)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', color: '#fff' }}>{item.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)', display: 'block' }}>Qty: {item.quantity}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--theme-accent, #00f0ff)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', height: 'fit-content' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total calculations & checkout */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--theme-text-muted)', fontSize: '0.9rem' }}>Grand Total:</span>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>${getCartTotal().toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  style={{ width: '100%', background: 'var(--theme-accent, #00f0ff)', border: 'none', color: '#000', padding: '12px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Check size={16} /> Complete Buyer Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generated Store Footer */}
      <footer style={{
        background: 'var(--theme-surface, #071330)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '24px',
        textAlign: 'center',
        marginTop: 'auto',
        fontSize: '0.75rem',
        color: 'var(--theme-text-muted)'
      }}>
        <div>© {new Date().getFullYear()} {store.name}. Powering business with custom web systems.</div>
        <div style={{ marginTop: '4px', opacity: 0.6 }}>Hosted securely via SOWWAN Sandbox Builder.</div>
      </footer>

    </div>
  );
}
