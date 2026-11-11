# Puesta en marcha de Supabase (proyecto compartido)

## Una sola vez
1. Crea el proyecto en Supabase.
2. SQL Editor → pega y ejecuta `supabase/schema.sql`.
3. Authentication → Sign In / Providers → Email: **desactiva "Allow new users to sign up"**
   (los usuarios los creas tú; nadie más puede registrarse).

## Por cada cliente nuevo
1. Authentication → Users → **Add user** (correo + clave inicial, marca *Auto confirm*).
   Al crearlo, un trigger crea solo su sitio (fila en `sites`) con `site_id` = el **User UID** del usuario.
2. Copia ese **User UID** al `.env.production` del repo del cliente: `VITE_SITE_ID=<uid>`
   (junto con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`; son valores públicos).
3. Haz push para publicar.
4. Entrega al cliente su correo y la clave inicial. En su **primer ingreso** al panel ("Configurar")
   un asistente le pide su **número de WhatsApp** (obligatorio) y le deja cambiar la clave.
   Ese número se guarda en `sites.config` y de ahí lo leen los enlaces, el modal de reservas,
   `turnos.html` y `servicios.html`.

> Ya no hace falta ejecutar SQL por cliente (`create_site` queda solo para casos especiales).

> Usa solo la **anon key** en el front. Nunca la `service_role`.
