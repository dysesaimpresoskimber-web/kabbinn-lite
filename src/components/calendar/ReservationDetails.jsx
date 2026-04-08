import React, { useState, useEffect } from 'react';
import { bookingServices } from '../../services/bookingServices';

export const ReservationDetails = ({ isOpen, onClose, event, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && event) {
      setFormData({
        nombre_cliente: event.nombre_cliente || '',
        telefono: event.telefono || '',
        forma_de_pago: event.forma_de_pago || '',
        monto: event.monto || '',
        cantidad_personas: event.cantidad_personas || 1,
        notas: event.notas || ''
      });
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar esta reserva de ${event.nombre_cliente}?`)) return;
    setSaving(true);
    try {
      await bookingServices.deleteBooking(event.id);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        monto: Number(formData.monto || 0),
        cantidad_personas: Number(formData.cantidad_personas || 1)
      };
      await bookingServices.updateClientDetails(event.propiedad, event.check_in, payload);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error al actualizar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '20px', color: 'var(--clr-text)' }}>Detalles de Reserva</h2>
        <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--clr-bg)', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 4px', fontSize: '14px' }}><strong>{event.propiedad}</strong> - {event.canal}</p>
          <p style={{ margin: '0', fontSize: '13px', color: 'var(--clr-text-light)' }}>{event.check_in} a {event.check_out}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Huésped Responsable</label>
            <input required type="text" value={formData.nombre_cliente} onChange={e => setFormData({...formData, nombre_cliente: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Monto Total (₡)</label>
              <input required type="number" value={formData.monto} onChange={e => setFormData({...formData, monto: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Personas</label>
              <input type="number" min="1" value={formData.cantidad_personas} onChange={e => setFormData({...formData, cantidad_personas: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Celular</label>
              <input type="text" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>F. de Pago</label>
              <input type="text" value={formData.forma_de_pago} onChange={e => setFormData({...formData, forma_de_pago: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
          </div>
          <div>
             <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Notas Privadas</label>
             <textarea rows="2" value={formData.notas} onChange={e => setFormData({...formData, notas: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button type="button" disabled={saving} onClick={handleDelete} className="btn-danger fade-in" style={{ background: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: saving ? 'wait' : 'pointer' }}>
              Eliminar
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: '6px' }}>Cerrar</button>
              <button type="submit" disabled={saving} style={{ background: 'var(--clr-primary)', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: saving ? 'wait' : 'pointer' }}>
                {saving ? 'Guardando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
