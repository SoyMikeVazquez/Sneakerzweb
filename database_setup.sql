-- Crear tabla de sucursales
CREATE TABLE IF NOT EXISTS public.sucursales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  horarios JSONB NOT NULL DEFAULT '[]'::jsonb,
  map_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para sucursales
ALTER TABLE public.sucursales ENABLE ROW LEVEL SECURITY;

-- Crear políticas para sucursales (público puede leer, admin puede todo)
CREATE POLICY "Permitir lectura pública de sucursales" ON public.sucursales FOR SELECT USING (true);
CREATE POLICY "Permitir todo a usuarios autenticados en sucursales" ON public.sucursales FOR ALL USING (auth.role() = 'authenticated');

-- Insertar datos iniciales de sucursales
INSERT INTO public.sucursales (nombre, direccion, horarios, map_url)
VALUES (
  'Puerto Mazatlán 3802',
  'Col. Las Brisas, Monterrey, Nuevo León, México',
  '[{"day": "Lunes – Viernes", "hours": "9:00 AM – 7:00 PM"}, {"day": "Sábado", "hours": "10:00 AM – 5:00 PM"}, {"day": "Domingo", "hours": "Cerrado"}]',
  'https://goo.gl/maps/TGrCgFY5yi5ViWDR9'
);

-- Crear tabla de servicios
CREATE TABLE IF NOT EXISTS public.servicios (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para servicios
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;

-- Crear políticas para servicios (público puede leer, admin puede todo)
CREATE POLICY "Permitir lectura pública de servicios" ON public.servicios FOR SELECT USING (true);
CREATE POLICY "Permitir todo a usuarios autenticados en servicios" ON public.servicios FOR ALL USING (auth.role() = 'authenticated');

-- Insertar o actualizar datos iniciales de servicios con las imágenes y textos correctos
INSERT INTO public.servicios (id, title, description, image, image_alt)
VALUES 
  ('sneakers', 'LIMPIEZA Y RESTAURACIÓN DE SNEAKERS', '¡Es hora de mimar a tus gorras y sneakers! Con nuestros servicios de limpieza, retoque de color, restauración y personalización, tus favoritos van a brillar más que nunca.', '/service-sneakers.jpg', 'Limpieza de sneakers'),
  ('residencial', 'LIMPIEZA TAPICERÍA RESIDENCIAL', '¡Ahora puedes programar la limpieza de tu sala, colchón y sillas para que tus muebles siempre estén frescos y huelan increíble! Dile adiós a las alergias.', '/service-residential.jpg', 'Limpieza residencial'),
  ('bolsos', 'LIMPIEZA DE BOLSOS / MALETAS', 'Tus bolsos y maletas de diseñador merecen el mejor cuidado. Nuestros especialistas los restauran y limpian para devolverles su brillo original.', '/service-bags.jpg', 'Limpieza de bolsos')
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  image_alt = EXCLUDED.image_alt;

-- -----------------------------------------------------------------------------
-- ALMACENAMIENTO DEL PORYECTO
-- -----------------------------------------------------------------------------

-- Crear bucket público "images" si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir lectura pública de las imágenes
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');

-- Política para permitir subida solo a usuarios autenticados
CREATE POLICY "Auth Insert" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Política para permitir actualización a usuarios autenticados
CREATE POLICY "Auth Update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'images' AND auth.role() = 'authenticated');
