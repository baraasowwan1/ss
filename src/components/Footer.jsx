import React from 'react';
import { Layers } from 'lucide-react';

export default function Footer({ setView }) {
  return (
    <footer style={{
      background: 'hsl(var(--bg-dark))',
      borderTop: '1px solid hsla(var(--text-primary) / 0.05)',
      padding: '48px 0 24px 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="grid-3" style={{ gap: '40px', marginBottom: '40px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                padding: '6px',
                borderRadius: '6px',
                display: 'inline-flex'
              }}>
                <Layers size={14} color="#000" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>SOWWAN</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', maxWidth: '300px' }}>
              Create instant online stores and business portfolios using state-of-the-art visual templates, backed by automated PayPal subscription workflows.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', color: '#fff' }}>Solutions</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <span onClick={() => setView('creator')} style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'hsl(var(--text-secondary))'}>
                  Store Setup Wizard
                </span>
              </li>
              <li>
                <span onClick={() => setView('landing')} style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'hsl(var(--text-secondary))'}>
                  Interactive Pricing
                </span>
              </li>
              <li>
                <span onClick={() => setView('admin')} style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--secondary)'} onMouseLeave={e => e.target.style.color = 'hsl(var(--text-secondary))'}>
                  Admin Panel
                </span>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', color: '#fff' }}>Developer Sandbox</h4>
            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
              This platform uses sandbox mode and high-fidelity integrations to simulate fully complete client sub-stores and automated admin suspension behaviors.
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid hsla(var(--text-primary) / 0.05)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
            © {new Date().getFullYear()} SOWWAN for Information Technology. All rights reserved.
          </span>
          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', display: 'flex', gap: '16px' }}>
            <span>Designed in Jordan</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
