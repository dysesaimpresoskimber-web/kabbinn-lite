require('dotenv').config({ path: '../.env.local' });
const ical = require('node-ical');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables correctly depending on execution context
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('YOUR_')) {
    console.error('❌ ERROR: Faltan credenciales de Supabase en el archivo .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const urls = [
    { cabina: 'Cabina 1', canal: 'Booking', url: 'https://ical.booking.com/v1/export?t=f76859d5-f30a-4e8f-ad2c-5d45105b3d79' },
    { cabina: 'Cabina 1', canal: 'Airbnb', url: 'https://www.airbnb.com/calendar/ical/1231502137704490398.ics?t=71d4f90883fb45adb0fe7018694aa587&locale=es-XL' },
    { cabina: 'Cabina 2', canal: 'Booking', url: 'https://ical.booking.com/v1/export?t=55b808ee-b60a-4663-bc46-b40134b31788' },
    { cabina: 'Cabina 2', canal: 'Airbnb', url: 'https://www.airbnb.com/calendar/ical/746678464898825365.ics?t=d9c2c36e21e944cf86524bf17e4c3e92&locale=es-XL' }
];

async function sincronizar() {
    console.log("🚀 Iniciando Sincronizador Kabbinn-Lite...");
    let reservas = [];

    for (const p of urls) {
        try {
            console.log(`Descargando eventos de ${p.cabina} - ${p.canal}...`);
            const eventos = await ical.async.fromURL(p.url);
            for (const e of Object.values(eventos)) {
                if (e.type === 'VEVENT') {
                    reservas.push({
                        propiedad: p.cabina,
                        canal: p.canal,
                        check_in: new Date(e.start).toISOString().split('T')[0],
                        check_out: new Date(e.end).toISOString().split('T')[0],
                        ultima_noche: new Date(new Date(e.end).setDate(new Date(e.end).getDate() - 1)).toISOString().split('T')[0],
                        nombre_cliente: 'Evento iCal' // Placeholder for UI protection
                    });
                }
            }
        } catch (err) { console.error(`Error procesando ${p.canal} en ${p.cabina}:`, err.message); }
    }

    if (reservas.length > 0) {
        // Asegurar array limpio y único antes de upsert
        const reservasUnicas = Object.values(
            reservas.reduce((acc, item) => {
                const key = `${item.propiedad}|${item.check_in}|${item.check_out}`;
                acc[key] = item;
                return acc;
            }, {})
        );

        console.log(`🔄 Actualizando DB con ${reservasUnicas.length} reservas procesadas...`);

        try {
            const { error } = await supabase.from('reservas_final').upsert(reservasUnicas, { onConflict: 'propiedad,check_in' });

            if (error) {
                console.error('❌ Error guardando en Supabase:', error.message);
            } else {
                console.log('✨ ¡Sincronización Completada con Éxito!');
            }
        } catch (err) {
            console.error('❌ Excepción de Red:', err.message || err);
        }
    } else {
        console.log('ℹ️ No se encontraron reservas en las validaciones de los URLs.');
    }
}

sincronizar();
