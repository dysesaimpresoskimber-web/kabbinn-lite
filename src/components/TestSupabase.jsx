import React, { useEffect, useState } from 'react';
import { bookingServices } from '../services/bookingServices';

export const TestSupabase = () => {
  const [status, setStatus] = useState('Procesando conexión a Supabase...');
  
  useEffect(() => {
    async function checkDB() {
      try {
        const data = await bookingServices.getReservations();
        setStatus(`✅ Conexión exitosa. Se encontraron ${data.length} reservas en la base de datos.`);
      } catch (err) {
        setStatus(`❌ Error de Conexión. Asegúrate de poner tus llaves en .env.local. Detalle: ${err.message}`);
      }
    }
    checkDB();
  }, []);

  return (
    <div style={{
      padding: '16px',
      marginBottom: '32px',
      borderRadius: '8px',
      backgroundColor: status.includes('✅') ? 'var(--clr-success-bg)' : status.includes('❌') ? 'var(--clr-danger-bg)' : '#fef3c7',
      color: status.includes('✅') ? 'var(--clr-success)' : status.includes('❌') ? 'var(--clr-danger)' : '#d97706',
      fontWeight: '500',
      textAlign: 'center',
      border: `1px solid ${status.includes('✅') ? 'var(--clr-success)' : status.includes('❌') ? 'var(--clr-danger)' : '#f59e0b'}`
    }}>
      {status}
    </div>
  );
};
