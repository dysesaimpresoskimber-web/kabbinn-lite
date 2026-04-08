import React, { useEffect, useState } from 'react';
import { DollarSign, CalendarCheck, Home, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { bookingServices } from '../../services/bookingServices';
import { isSameMonth, parseISO } from 'date-fns';

export const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    ventasMes: 0,
    reservasMes: 0,
    cabinaFavorita: '-',
    tarifaPromedio: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const reservas = await bookingServices.getReservations();
        const hoy = new Date();
        
        let ventas = 0;
        let conteo = 0;
        const cabinas = {};

        // Monthly chart agg (roughly classifying by month index)
        const montlyAgg = [
          { name: 'Ene', ventas: 0 }, { name: 'Feb', ventas: 0 }, { name: 'Mar', ventas: 0 },
          { name: 'Abr', ventas: 0 }, { name: 'May', ventas: 0 }, { name: 'Jun', ventas: 0 },
          { name: 'Jul', ventas: 0 }, { name: 'Ago', ventas: 0 }, { name: 'Sep', ventas: 0 },
          { name: 'Oct', ventas: 0 }, { name: 'Nov', ventas: 0 }, { name: 'Dic', ventas: 0 },
        ];

        reservas.forEach(r => {
          if (!r.check_in) return;
          const fecha = parseISO(r.check_in);
          
          // Chart aggregation
          montlyAgg[fecha.getMonth()].ventas += Number(r.monto || 0);

          // Current month stats
          if (isSameMonth(fecha, hoy)) {
            ventas += Number(r.monto || 0);
            conteo++;
            cabinas[r.propiedad] = (cabinas[r.propiedad] || 0) + 1;
          }
        });

        let fav = '-';
        let max = 0;
        for (const [c, v] of Object.entries(cabinas)) {
          if (v > max) { max = v; fav = c; }
        }

        setStats({
          ventasMes: ventas,
          reservasMes: conteo,
          cabinaFavorita: fav,
          tarifaPromedio: conteo > 0 ? Math.round(ventas / conteo) : 0,
          chartData: montlyAgg.filter(m => m.ventas > 0 || m.name === 'Ene') // Filter empty months for cleaner view
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Dashboard de Resumen</h1>
        <p style={{ color: 'var(--clr-text-light)' }}>Métricas extraídas en tiempo real de Supabase.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="label">Ventas del Mes</div>
            <div className="value">$ {loading ? '...' : stats.ventasMes.toLocaleString()}</div>
          </div>
          <div className="stat-icon green"><DollarSign size={24} /></div>
        </div>
        
        <div className="stat-card">
          <div className="stat-info">
            <div className="label">Reservas del Mes</div>
            <div className="value">{loading ? '...' : stats.reservasMes}</div>
          </div>
          <div className="stat-icon blue"><CalendarCheck size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="label">Cabina Más Rentada</div>
            <div className="value">{loading ? '...' : stats.cabinaFavorita}</div>
          </div>
          <div className="stat-icon red"><Home size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="label">Tarifa Promedio</div>
            <div className="value">$ {loading ? '...' : stats.tarifaPromedio}</div>
          </div>
          <div className="stat-icon blue"><PieChart size={24} /></div>
        </div>
      </div>

      <div style={{ background: 'var(--clr-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--clr-border)', height: '400px' }}>
        <h3 style={{ marginBottom: '24px', fontWeight: 600 }}>Crecimiento de Ventas Histórico</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--clr-border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--clr-text-light)'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--clr-text-light)'}} />
            <Tooltip 
              cursor={{fill: 'rgba(29, 78, 216, 0.05)'}} 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} 
            />
            <Bar dataKey="ventas" fill="var(--clr-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
