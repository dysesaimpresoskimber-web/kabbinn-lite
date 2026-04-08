import React from 'react';

export const LogoHeader = ({ onNew }) => {
  return (
    <header style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 24px',
      background: 'var(--clr-surface)',
      borderBottom: '1px solid var(--clr-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ color: 'var(--clr-primary)', fontWeight: 800, fontSize: '36px', letterSpacing: '-1.5px', lineHeight: '1.2' }}>
        <span style={{ fontSize: '48px', display: 'block', textAlign: 'center', marginBottom: '-10px' }}>K</span>
        KABBIIN
      </div>
      <div style={{
        marginTop: '4px',
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--clr-text-light)',
        letterSpacing: '4px',
        textTransform: 'uppercase'
      }}>
        Lite
      </div>
    </header>
  );
};
