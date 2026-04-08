import React, { useState } from 'react';
import { Home, Calendar as CalendarIcon, Key, Archive, CheckSquare, MessageSquare, DollarSign, FileText, Settings, Plus, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: Home, path: '/' },
  { label: 'Calendario', icon: CalendarIcon, path: '/calendar' },
  { label: 'Mis Cabinas', icon: Key, path: '/cabins' },
  { label: 'Inventario', icon: Archive, path: '/inventory' },
  { label: 'Tareas', icon: CheckSquare, path: '/tasks' },
  { label: 'Mensajería', icon: MessageSquare, path: '/messages' },
  { label: 'Gastos', icon: DollarSign, path: '/expenses' },
  { label: 'Reportes', icon: FileText, path: '/reports' },
  { label: 'Configuración', icon: Settings, path: '/settings' },
];

export const Sidebar = ({ isOpen, toggleMobileMenu, onNewReservation }) => {
  const location = useLocation();

  return (
    <aside className={`sidebar fade-in ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ color: 'var(--clr-primary)', fontWeight: 800, fontSize: '24px', letterSpacing: '-1px', marginBottom: '20px' }}>
          <span style={{ fontSize: '36px', display: 'block', textAlign: 'center' }}>K</span>
          KABBIIN-<span style={{fontWeight: 300}}>LITE</span>
        </div>
      </div>
      
      <button className="sidebar-new-btn" onClick={onNewReservation}>
        <Plus size={18} /> Nueva Reserva
      </button>

      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                if(window.innerWidth <= 1024) toggleMobileMenu();
              }}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
