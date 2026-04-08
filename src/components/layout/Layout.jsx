import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ReservationForm } from '../calendar/ReservationForm';

export const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={mobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
        onNewReservation={() => setIsNewReservationOpen(true)} 
      />
      
      {/* Overlay for mobile when sidebar is open */}
      {mobileMenuOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 90 }} 
          onClick={toggleMobileMenu}
        />
      )}

      <main className="main-content">
        <Header toggleMobileMenu={toggleMobileMenu} />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>

      <ReservationForm 
        isOpen={isNewReservationOpen} 
        onClose={() => setIsNewReservationOpen(false)}
        onSuccess={() => {
           // Optionally emit event or refresh context
           console.log("Reservation created");
        }}
      />
    </div>
  );
};
