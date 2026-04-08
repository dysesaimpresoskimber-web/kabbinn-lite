import React, { useState } from 'react';
import { bookingServices } from '../../services/bookingServices';

export const ReservationForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    propiedad: 'Cabina 1',
    cliente: '',
    cantidad_personas: 1,
    check_in: '',
    check_out: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookingServices.createReservation(formData);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      alert('Error creating reservation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Nueva Reserva (Manual)</h2>
          <button className="btn btn-secondary" onClick={onClose} style={{padding: '4px 10px'}}>X</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Propiedad</label>
            <select name="propiedad" className="form-control" value={formData.propiedad} onChange={handleChange} required>
              <option value="Cabina 1">Cabina 1</option>
              <option value="Cabina 2">Cabina 2</option>
              <option value="Cabina 3">Cabina 3</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nombre del Cliente</label>
            <input type="text" name="cliente" className="form-control" value={formData.cliente} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Cantidad Personas</label>
            <input type="number" name="cantidad_personas" className="form-control" value={formData.cantidad_personas} min="1" onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Check-in</label>
              <input type="date" name="check_in" className="form-control" value={formData.check_in} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Check-out</label>
              <input type="date" name="check_out" className="form-control" value={formData.check_out} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
