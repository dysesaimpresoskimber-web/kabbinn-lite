import React from 'react';
import { Menu, Bell } from 'lucide-react';

export const Header = ({ toggleMobileMenu }) => {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="mobile-menu-btn btn btn-secondary" onClick={toggleMobileMenu} style={{ border: 'none', padding: '8px' }}>
          <Menu size={24} />
        </button>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--clr-text)' }}>
          Kabbinn Lite Workspace
        </h2>
      </div>

      <div className="header-user">
        <button className="btn btn-secondary" style={{ border: 'none', padding: '8px', borderRadius: '50%' }}>
          <Bell size={20} color="var(--clr-text-light)" />
        </button>
        
        <div className="user-info" style={{ textAlign: 'right', display: 'none' /* hidden on very small screens */ }}>
          <div className="name">Esteban Test</div>
          <div className="role">Admin</div>
        </div>
        <div className="user-avatar">
          EC
        </div>
      </div>
    </header>
  );
};
