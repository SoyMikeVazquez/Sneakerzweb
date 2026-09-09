CREATE TABLE public."Finanzas" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre_registro TEXT NOT NULL,
    descripcion TEXT,
    monto_cobrar NUMERIC NOT NULL,
    adelanto NUMERIC DEFAULT 0,
    contacto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS si se desea, aunque para un panel admin puede estar abierto
ALTER TABLE public."Finanzas" ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todo a usuarios autenticados (opcional, ajusta según necesidad)
CREATE POLICY "Allow all actions for authenticated users" ON public."Finanzas"
    FOR ALL
    TO authenticated
    USING (true);
