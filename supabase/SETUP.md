# Puesta en marcha de Supabase (proyecto compartido)

## Una sola vez
1. Crea el proyecto en Supabase.
2. SQL Editor → pega y ejecuta `supabase/schema.sql`.
3. Authentication → Sign In / Providers → Email: **desactiva "Allow new users to sign up"**
   (los usuarios los creas tú; nadie más puede registrarse).

## Por cada cliente nuevo
1. Authentication → Users → **Add user** (correo + clave inicial, marca *Auto confirm*).
2. SQL Editor: `select public.create_site('thays', 'correo-del-cliente@gmail.com');`
3. En el repositorio del cliente edita `.env.production` con la URL, la anon key y el `VITE_SITE_ID`
   del proyecto Supabase (son valores públicos; ya no hace falta configurar variables en GitHub).
4. Haz push para publicar. El cliente entra al panel con su correo y clave y todo lo que edite se guarda solo.

> Usa solo la **anon key** en el front. Nunca la `service_role`.
