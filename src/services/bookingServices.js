import { supabase } from './supabaseClient';

export const bookingServices = {
  // Fetch reservations
  async getReservations() {
    const { data, error } = await supabase
      .from('reservas_final') // Matching user table
      .select('*')
      .order('check_in', { ascending: true });
    
    if (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
    return data;
  },

  // Create a manual reservation
  async createReservation(reservationData) {
    const { data, error } = await supabase
      .from('reservas_final')
      .insert([{
        propiedad: reservationData.propiedad,
        nombre_cliente: reservationData.cliente,
        cantidad_personas: reservationData.cantidad_personas || 1,
        check_in: reservationData.check_in,
        check_out: reservationData.check_out,
        canal: 'Manual'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
    return data;
  },

  // Delete a reservation
  async deleteReservation(id) {
    const { data, error } = await supabase
      .from('reservas_final')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
    return data;
  }
};
