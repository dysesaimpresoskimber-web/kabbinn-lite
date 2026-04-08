import React, { useState } from 'react';
import { bookingServices } from '../../services/bookingServices';
import { format, parseISO } from 'date-fns';

export const ReservationDetails = ({ isOpen, onClose, event, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !event) return null;

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que deseas eliminar esta reserva? (Si viene de iCal, el sincronizador podría volver a insertarla si no se ha borrado en origen).")) {
      setLoading(true);
      try {
        await bookingServices.deleteReservation(event.id);
        if (onDeleteSuccess) onDeleteSuccess();
        onClose();
      } catch (error) {
        alert("Error al eliminar: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Detalles de Reserva</h2>
          <button className="btn btn-secondary" onClick={onClose} style={{padding: '4px 10px'}}>X</button>
        </div>

        <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
          <div>
            <span style={{color: 'var(--clr-text-light)', fontSize: '13px'}}>Cliente</span>
            <div style={{fontWeight: 600, fontSize: '18px'}}>{event.cliente || event.nombre_cliente}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
             <div>
               <span style={{color: 'var(--clr-text-light)', fontSize: '13px'}}>Propiedad</span>
               <div style={{fontWeight: 500}}>{event.propiedad || 'Cabina ' + event.cabin_id}</div>
             </div>
             <div>
               <span style={{color: 'var(--clr-text-light)', fontSize: '13px'}}>Canal</span>
               <div style={{fontWeight: 500}}>{event.canal}</div>
             </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
             <div>
               <span style={{color: 'var(--clr-text-light)', fontSize: '13px'}}>Check-In</span>
               <div style={{fontWeight: 500}}>{format(event.check_in instanceof Date ? event.check_in : parseISO(event.check_in), 'dd MMM yyyy')}</div>
             </div>
             <div>
               <span style={{color: 'var(--clr-text-light)', fontSize: '13px'}}>Check-Out</span>
               <div style={{fontWeight: 500}}>{format(event.check_out instanceof Date ? event.check_out : parseISO(event.check_out), 'dd MMM yyyy')}</div>
             </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose} disabled={loading}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
