import React, { useState, useEffect } from 'react';
import { Layers, Sparkles, Zap, Award, Globe, ShoppingCart, ShieldCheck } from 'lucide-react';
import Calculator from '../components/Calculator';

export default function Landing({ setView, setSelectedPlan }) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: 'Automated Creator Wizard',
      desc: 'Pick your niche, name your subdomain, and generate complete page content instantly.',
      icon: <Sparkles size={24} color="var(--primary)" />
    },
    {
      title: 'Stunning Theme Overrides',
      desc: 'Sunset Gold, Emerald Glass, Cyberpunk Blue, or Deep Amethyst. Switch in one click.',
      icon: <Layers size={24} color="var(--secondary)" />
    },
    {
      title: 'Flexible E-Commerce',
      desc: 'Add products, prices, and configure a fully functional customer shopping cart.',
      icon: <ShoppingCart size={24} color="var(--gold)" />
    },
    {
      title: 'PayPal Subscription Paywall',
      desc: 'Collect recurring income from your users or purchase your store subscription safely.',
      icon: <ShieldCheck size={24} color="var(--emerald)" />
    }
  ];

  // Rotate features automatically for visual playfulness
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchPlan = (planId) => {
    setSelectedPlan(planId);
    setView('creator');
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      
      {/* 1. Hero Section */}
      <header style={{
        textAlign: 'center',
        padding: '80px 0 60px 0',
        position: 'relative'
      }}>
        {/* Glow backdrop circles */}
        <div className="spin-slow" style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, hsla(var(--primary-hsl) / 0.15) 0%, transparent 60%)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'hsla(var(--text-primary) / 0.04)',
          border: '1px solid hsla(var(--text-primary) / 0.08)',
          padding: '6px 16px',
          borderRadius: '9999px',
          marginBottom: '24px'
        }}>
          <Zap size={14} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Next-Gen SaaS Store Builder
          </span>
        </div>

        <h1 style={{
          fontSize: '3.8rem',
          fontFamily: 'Outfit',
          lineHeight: 1.1,
          marginBottom: '24px',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
          fontWeight: 800
        }}>
          Deploy Your Custom Store or Website in{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Seconds
          </span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'hsl(var(--text-secondary))',
          maxWidth: '650px',
          margin: '0 auto 40px auto',
          fontWeight: 400
        }}>
          An elegant premium website builder for online shops and corporate portfolios. Specify your earnings, configure pages, and pay with PayPal subscriptions.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => handleLaunchPlan('professional')} className="btn btn-primary pulse-glow" style={{ fontSize: '1rem', padding: '14px 32px' }}>
            Get Started Now
          </button>
          <button onClick={() => setView('admin')} className="btn btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
            Monitor Subscriptions
          </button>
        </div>
      </header>

      {/* 2. Real-Time Store Visual Showcase */}
      <section style={{ margin: '40px 0 80px 0', position: 'relative' }}>
        <div className="glass-panel" style={{
          border: '1px solid hsla(var(--text-primary) / 0.1)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Header resembling a browser */}
          <div style={{
            background: 'hsl(var(--bg-dark))',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: '8px',
            borderBottom: '1px solid hsla(var(--text-primary) / 0.08)'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <div style={{
              background: 'hsla(var(--text-primary) / 0.05)',
              flex: 1,
              maxWidth: '500px',
              margin: '0 auto',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: 'hsl(var(--text-muted))',
              textAlign: 'center',
              padding: '2px 0',
              fontFamily: 'monospace'
            }}>
              sowwan.app/your-brand-name
            </div>
          </div>

          {/* Interactive display showing off customized styles */}
          <div style={{
            padding: '40px',
            minHeight: '340px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.5s',
            background: activeFeature === 0 ? 'linear-gradient(135deg, #0a1910, #050c08)' :
                        activeFeature === 1 ? 'linear-gradient(135deg, #1b0c2c, #0b0512)' :
                        activeFeature === 2 ? 'linear-gradient(135deg, #1a120b, #0d0905)' :
                                              'linear-gradient(135deg, #071330, #030816)'
          }}>
            <div className="glass-panel" style={{
              padding: '32px',
              width: '100%',
              maxWidth: '650px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              <span style={{
                color: activeFeature === 0 ? 'var(--emerald)' :
                       activeFeature === 1 ? 'var(--secondary)' :
                       activeFeature === 2 ? 'var(--gold)' :
                                             'var(--primary)',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: '8px'
              }}>
                Feature Spotlight
              </span>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', color: '#fff', marginBottom: '12px' }}>
                {features[activeFeature].title}
              </h2>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {features[activeFeature].desc}
              </p>
              
              {/* Dynamic feature selector indicators */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                {features.map((_, idx) => (
                  <span 
                    key={idx} 
                    onClick={() => setActiveFeature(idx)}
                    style={{
                      width: activeFeature === idx ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: activeFeature === idx ? 'var(--primary)' : 'hsla(var(--text-primary) / 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing & Calculator Section */}
      <section style={{ margin: '60px 0 80px 0' }}>
        <Calculator onSelectPlan={handleLaunchPlan} />
      </section>

      {/* 4. Stat Grid Showcase */}
      <section style={{ marginTop: '40px' }}>
        <div className="grid-3" style={{ gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <Globe size={32} color="var(--primary)" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800 }}>99.9%</h3>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Vercel Live Uptime Guarantee
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <Award size={32} color="var(--secondary)" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800 }}>100+</h3>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Websites Deployed Today
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <Layers size={32} color="var(--gold)" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800 }}>100%</h3>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Client Satisfaction Rate
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
