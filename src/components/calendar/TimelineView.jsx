import React, { useMemo, useState } from 'react';
import { addDays, format, differenceInDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReservationDetails } from './ReservationDetails';

// Mock data
const mockCabins = [
  { id: 1, name: 'Cabina #1 - Selva', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=150&q=80' },
  { id: 2, name: 'Cabina #2 - Vista', image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=150&q=80' },
  { id: 3, name: 'Cabina #3 - Río', image: 'https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=150&q=80' },
];

const mockEvents = [
  { id: 101, cabin_id: 1, canal: 'Booking', check_in: new Date(), check_out: addDays(new Date(), 3), cliente: 'Juan Perez' },
  { id: 102, cabin_id: 1, canal: 'Airbnb', check_in: addDays(new Date(), 4), check_out: addDays(new Date(), 6), cliente: 'Ana Gomez' },
  { id: 103, cabin_id: 2, canal: 'Manual', check_in: addDays(new Date(), 1), check_out: addDays(new Date(), 5), cliente: 'Carlos Díaz' },
];

export const TimelineView = ({ startDate = new Date(), numDays = 30 }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Generate header dates
  const dates = useMemo(() => {
    return Array.from({ length: numDays }).map((_, i) => addDays(startDate, i));
  }, [startDate, numDays]);

  const getEventStyle = (event) => {
    const startOffset = Math.max(0, differenceInDays(startOfDay(event.check_in), startOfDay(startDate)));
    const duration = differenceInDays(startOfDay(event.check_out), startOfDay(event.check_in));
    
    // Each day is 40px wide as per our CSS index.css grid (repeat(30, 40px))
    return {
      left: `${startOffset * 40}px`,
      width: `${duration * 40}px`,
    };
  };

  const getEventClass = (canal) => {
    if (canal === 'Airbnb') return 'event-airbnb';
    if (canal === 'Booking') return 'event-booking';
    return 'event-manual';
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Calendario de Reservas</h1>
          <p style={{ color: 'var(--clr-text-light)' }}>Gestión visual de ocupación de las cabinas.</p>
        </div>
      </div>

      <div className="timeline-container">
        {/* Header Row (Dates) */}
        <div className="timeline-header-row" style={{ gridTemplateColumns: `200px repeat(${numDays}, 40px)` }}>
          <div className="timeline-cabin-cell" style={{ borderBottom: 'none' }}>
            <span style={{ color: 'var(--clr-text-light)' }}>Cabinas</span>
          </div>
          {dates.map((date, i) => (
            <div key={i} className="timeline-date-cell">
              <div>{format(date, 'EEEEE', { locale: es }).toUpperCase()}</div>
              <div style={{ fontSize: '16px', color: 'var(--clr-text)', marginTop: '4px' }}>{format(date, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Rows for each Cabin */}
        {mockCabins.map(cabin => {
          const cabinEvents = mockEvents.filter(e => e.cabin_id === cabin.id);

          return (
            <div key={cabin.id} className="timeline-row" style={{ gridTemplateColumns: `200px 1fr` }}>
              <div className="timeline-cabin-cell">
                <img src={cabin.image} alt={cabin.name} className="cabin-image" />
                <span>{cabin.name}</span>
              </div>
              
              <div className="timeline-events-area" style={{ gridTemplateColumns: `repeat(${numDays}, 40px)` }}>
                {/* Background grid cells for visual alignment */}
                {dates.map((_, i) => (
                  <div key={`cell-${i}`} style={{ borderRight: '1px solid var(--clr-border)', height: '100%' }}></div>
                ))}
                
                {/* Events plotted absolutely over the row */}
                {cabinEvents.map(evt => (
                  <div 
                    key={evt.id} 
                    className={`event-block ${getEventClass(evt.canal)}`}
                    style={getEventStyle(evt)}
                    title={`${evt.cliente} - ${evt.canal}`}
                    onClick={() => setSelectedEvent(evt)}
                  >
                    {evt.cliente}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ReservationDetails 
        isOpen={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDeleteSuccess={() => {
          console.log("Deleted");
          setSelectedEvent(null);
        }}
      />
    </div>
  );
};
