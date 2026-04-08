import React, { useState, useEffect } from 'react';
import { bookingServices } from '../../services/bookingServices';

export const ReservationForm = ({ isOpen, onClose, onSuccess, initialDate }) => {
  const [formData, setFormData] = useState({
    propiedad: 'Cabina 1',
    nombre_cliente: '',
    check_in: '',
    check_out: '',
    telefono: '',
    forma_de_pago: 'Efectivo',
    monto: '',
    cantidad_personas: 1,
    notas: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, check_in: initialDate || '' }));
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await bookingServices.addBooking(formData);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', color: 'var(--clr-text)' }}>Nueva Reserva Manual</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--clr-text-light)' }}>Propiedad *</label>
              <select required value={formData.propiedad} onChange={e => setFormData({...formData, propiedad: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)', background: 'var(--clr-bg)' }}>
                <option value="Cabina 1">Cabina 1</option>
                <option value="Cabina 2">Cabina 2</option>
                <option value="Cabina 3">Cabina 3</option>
                <option value="Cabina 4">Cabina 4</option>
                <option value="Cabina 5">Cabina 5</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--clr-text-light)' }}>Cliente *</label>
              <input required type="text" value={formData.nombre_cliente} onChange={e => setFormData({...formData, nombre_cliente: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--clr-text-light)' }}>Check In *</label>
              <input required type="date" value={formData.check_in} onChange={e => setFormData({...formData, check_in: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--clr-text-light)' }}>Check Out *</label>
              <input required type="date" value={formData.check_out} onChange={e => setFormData({...formData, check_out: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--clr-text-light)' }}>Monto Total (₡) *</label>
              <input required type="number" value={formData.monto} onChange={e => setFormData({...formData, monto: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--clr-text-light)' }}>Personas</label>
              <input type="number" min="1" value={formData.cantidad_personas} onChange={e => setFormData({...formData, cantidad_personas: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--clr-text-light)' }}>Celular / Teléfono</label>
              <input type="text" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--clr-text-light)' }}>Forma de Pago</label>
              <input type="text" value={formData.forma_de_pago} onChange={e => setFormData({...formData, forma_de_pago: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)' }} />
            </div>
          </div>

          <div>
             <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--clr-text-light)' }}>Notas Privadas</label>
             <textarea rows="2" value={formData.notas} onChange={e => setFormData({...formData, notas: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--clr-border)', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px', borderRadius: '6px' }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} style={{ background: 'var(--clr-primary)', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: saving ? 'wait' : 'pointer' }}>
              {saving ? 'Guardando...' : 'Guardar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
