import { supabase } from './supabaseClient';

export const bookingServices = {
  getReservations: async () => {
    const { data, error } = await supabase
      .from('reservas_final')
      .select('*')
      .order('check_in', { ascending: true });
      
    if (error) throw error;
    return data;
  },
  
  addBooking: async (payload) => {
    // Calculamos ultima_noche basado en check_out
    const checkOutDate = new Date(payload.check_out + 'T12:00:00Z');
    checkOutDate.setDate(checkOutDate.getDate() - 1);
    const ultima_noche = checkOutDate.toISOString().split('T')[0];

    const dataToInsert = {
      propiedad: payload.propiedad,
      canal: 'Manual',
      check_in: payload.check_in,
      check_out: payload.check_out,
      ultima_noche: ultima_noche,
      nombre_cliente: payload.nombre_cliente,
      telefono: payload.telefono || '',
      notas: payload.notas || '',
      forma_de_pago: payload.forma_de_pago || '',
      monto: Number(payload.monto || 0),
      cantidad_personas: Number(payload.cantidad_personas || 1)
    };

    console.log("Insertando en DB:", dataToInsert);
    const { error } = await supabase.from('reservas_final').insert([dataToInsert]);
    if (error) throw error;
    return true;
  },

  updateClientDetails: async (propiedad, check_in, updatePayload) => {
    console.log(`Actualizando DB para ${propiedad} en ${check_in}:`, updatePayload);
    const { error } = await supabase
      .from('reservas_final')
      .update(updatePayload)
      .match({ propiedad, check_in });
      
    if (error) throw error;
    return true;
  },

  deleteBooking: async (id) => {
    console.log(`Eliminando reserva ID:`, id);
    const { error } = await supabase
      .from('reservas_final')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
