import React, { useState, useEffect, useMemo } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isToday, parseISO, isWithinInterval, startOfDay 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { bookingServices } from '../../services/bookingServices';

export const MonthlyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await bookingServices.getReservations();
        const validData = data.filter(r => r.check_in && r.check_out);
        setReservations(validData);
      } catch (err) {
        console.error("Error al cargar las reservas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Determine calendar grid bounds
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Map events to days
  const getEventsForDay = (day) => {
    return reservations.filter(res => {
      const start = startOfDay(parseISO(res.check_in));
      const end = startOfDay(parseISO(res.check_out));
      const dayStart = startOfDay(day);
      return dayStart >= start && dayStart < end; // Doesn't include checkout day explicitly as full block
    });
  };

  const getEventColor = (canal) => {
    if (canal === 'Airbnb') return '#ef4444'; // Red
    if (canal === 'Booking') return '#1d4ed8'; // Blue
    return '#f59e0b'; // Manual / Orange
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Calendario de Ocupación</h2>
          <p style={{ color: 'var(--clr-text-light)' }}>Visualización mensual y disponibilidad.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={handlePrevMonth} className="btn btn-secondary">Anterior</button>
          <span style={{ fontSize: '18px', fontWeight: 600, textTransform: 'capitalize' }}>
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </span>
          <button onClick={handleNextMonth} className="btn btn-secondary">Siguiente</button>
        </div>
      </div>

      <div style={{ background: 'var(--clr-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--clr-border)', overflow: 'hidden' }}>
        {/* Days of week header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--clr-border)', background: 'var(--clr-bg)' }}>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: 'var(--clr-text-light)', borderRight: '1px solid var(--clr-border)' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {loading ? (
             <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--clr-text-light)' }}>
               Cargando reservas...
             </div>
          ) : days.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            // Pintamos rojo si está ocupado, sino verde clarito, dependiendo si tiene eventos
            const bgColor = !isCurrentMonth ? '#f9fafb' : dayEvents.length > 0 ? '#FFEBEB' : '#E6F4EA';

            return (
              <div key={day.toString()} style={{ 
                minHeight: '120px', 
                background: bgColor,
                borderRight: '1px solid var(--clr-border)',
                borderBottom: '1px solid var(--clr-border)',
                padding: '8px',
                opacity: isCurrentMonth ? 1 : 0.5
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ 
                    fontWeight: 600, 
                    color: isToday(day) ? '#fff' : 'inherit',
                    background: isToday(day) ? 'var(--clr-primary)' : 'transparent',
                    padding: isToday(day) ? '2px 8px' : '0',
                    borderRadius: '12px'
                  }}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {dayEvents.map(evt => (
                    <div key={evt.id} style={{
                      background: getEventColor(evt.canal),
                      color: '#fff',
                      fontSize: '11px',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer'
                    }} title={`${evt.propiedad} - ${evt.nombre_cliente} (${evt.canal})`}>
                      {evt.propiedad}: {evt.nombre_cliente}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
