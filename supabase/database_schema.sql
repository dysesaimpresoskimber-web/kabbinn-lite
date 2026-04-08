-- ESQUEMA DE BASE DE DATOS PARA KABBIIN LITE
-- Este script crea la tabla `reservas_final` asegurando compatibilidad con el sincronizador iCal

CREATE TABLE public.reservas_final (
    id SERIAL PRIMARY KEY,
    propiedad TEXT NOT NULL,
    nombre_cliente TEXT NOT NULL,
    cantidad_personas INTEGER DEFAULT 1,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    ultima_noche DATE,
    canal TEXT,
    telefono TEXT,
    forma_pago TEXT,
    monto NUMERIC,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Constraint de unicidad para evitar duplicados en el UPSERT del sincronizador
-- Consideramos que una cabina no puede tener dos reservas creadas exactamente en el mismo check-in
ALTER TABLE public.reservas_final
ADD CONSTRAINT reservas_final_propiedad_check_in_key UNIQUE (propiedad, check_in);

-- Desactivar RLS por defecto para el cliente (Si necesitas RLS activo, debes modificar esto o usar claves secretas)
ALTER TABLE public.reservas_final ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura Anonima" ON public.reservas_final
FOR SELECT USING (true);

-- (Opcional) Trigger para auto-update del updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reservas_final_updated_at
BEFORE UPDATE ON public.reservas_final
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
