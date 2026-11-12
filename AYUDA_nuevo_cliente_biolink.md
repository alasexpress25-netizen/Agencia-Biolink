# Guía: vender un Biolink a un cliente nuevo

Proyecto Supabase compartido: **Biolink** (`ijvyvnhvopkevybwlfms`)
Todos los clientes usan el mismo proyecto. Cada uno es una fila en la tabla `sites`.

---

## Cómo funciona (para no olvidarlo)

- **`src/data/clientConfig.json`** (en el repo) = base estática: título, PWA, y lo que leen `turnos.html` y `servicios.html`.
- **`sites.config`** (en Supabase) = lo que ven los visitantes y lo que el cliente edita desde "Configurar".
- Si la fila de Supabase está vacía (`{}`), la app usa el `clientConfig.json`. Cuando el dueño guarda por primera vez, se escribe en Supabase.
- **`VITE_SITE_ID`** (en `.env.production`) le dice a cada repo qué fila de `sites` usar.
- El login acepta **usuario o correo**. Si el cliente escribe solo `maria`, la app arma `maria@<VITE_LOGIN_DOMAIN>` (hoy: `lavisualmk.alastecno.com`). Ese correo es inventado y nunca recibe mensajes.

---

## 0. Datos que pedirle al cliente (antes de empezar)

- [ ] Nombre del negocio y @usuario
- [ ] Frase corta (bio) y ciudad
- [ ] Foto de perfil (cuadrada, se guarda como `public/avatar.jpg`) y logo
- [ ] Número de WhatsApp **con código de país** (ej. `5548999053493`)
- [ ] Sus redes reales (Instagram, YouTube, TikTok, etc.): **no copiar las de otro cliente**
- [ ] Servicios: nombre, precio, duración (si no los tiene, dejar vacío; no inventar)
- [ ] Idioma principal (`pt` o `es`)
- [ ] Colores o estilo que le gusten

---

## 1. Crear el repo del cliente

1. Crear un repo nuevo en GitHub (ej. `biolink-cliente`).
2. Copiar el proyecto base (usar el zip más reciente, sin `node_modules` ni `dist`).
3. Reemplazar `src/data/clientConfig.json` por el del cliente:
   - Partir de `clientConfig.agencia.json` (la plantilla).
   - Revisar **todos** los textos: nombre, bio, handle, footer, redes, servicios, links.
   - Poner `defaultLang` (`"pt"` o `"es"`).
   - Poner todos los `clicks` en 0.
   - Desactivar (`"active": false`) o borrar links que no existan (ej. `cursos.html` no existe en `public/`).
   - No dejar servicios, mails ni redes de otro cliente.

> Atajo: personalizar todo desde el panel "Configurar" de un sitio de prueba, ir a **Copia de Seguridad** y descargar `clientConfig.json`.

4. **Foto de perfil:** subir la foto del cliente al repo en `public/avatar.jpg`.
   - El nombre es exacto: minúsculas y extensión `.jpg` (GitHub Pages distingue mayúsculas).
   - Cuadrada y liviana (ej. 400x400 px, menos de 200 KB).
   - Ya no se edita desde el panel: siempre se lee de ese archivo.

---

## 2. Crear el sitio y el usuario en Supabase

Elegí un **site_id** corto: minúsculas, números y guiones, de 2 a 40 caracteres (ej. `maria-nails`).

### Opción A (recomendada): site_id con nombre

1. En **SQL Editor**, crear la fila vacía:
   ```sql
   insert into public.sites (site_id) values ('maria-nails');
   ```
2. En **Authentication → Users → Add user**:
   - Email: `maria-nails@lavisualmk.alastecno.com` (la parte antes de la `@` debe ser **exactamente** el site_id)
   - Password: una clave inicial
   - Marcar **Auto confirm**
3. El trigger `handle_new_user_site` asigna la fila `maria-nails` a ese usuario.
4. `VITE_SITE_ID=maria-nails`

### Opción B: site_id = UID del usuario

1. Add user con cualquier correo y **Auto confirm**.
2. El trigger crea el sitio con `site_id` = **User UID**.
3. Copiar el **User UID** (columna en Authentication → Users) → ese es el `VITE_SITE_ID`.

### Si la fila no quedó asignada

Si creaste el usuario con otro correo y ya existe la fila, asignala a mano:
```sql
select public.create_site('maria-nails', 'correo-que-pusiste@...');
```

### Verificar que quedó el dueño

```sql
select site_id, owner_id from public.sites where site_id = 'maria-nails';
```
`owner_id` **no** debe ser null.

---

## 3. Configurar el repo del cliente

En `.env.production` (y `.env.development`):

```
VITE_SUPABASE_URL=https://ijvyvnhvopkevybwlfms.supabase.co
VITE_SUPABASE_ANON_KEY=<la anon key del proyecto>
VITE_SITE_ID=maria-nails
VITE_LOGIN_DOMAIN=lavisualmk.alastecno.com
```

- **Importante:** cambiar `VITE_SITE_ID`. El zip base trae `agencia`.
- Usar solo la **anon key**. **Nunca** la `service_role`.
- **Los archivos que empiezan con punto** (`.env.production`, `.github/`) a veces **no se suben** al arrastrar archivos en la web de GitHub. Por eso el `deploy.yml` también trae estas variables en el paso *Build* (son valores públicos). Si cambiás el `VITE_SITE_ID`, cambialo **también en `.github/workflows/deploy.yml`**.
- El dominio de `VITE_LOGIN_DOMAIN` tiene que ser el mismo que usaste en el correo del paso 2.

Probar local (opcional):
```bash
npm install --legacy-peer-deps
npm run build
```

---

## 4. Publicar

1. `git add . && git commit -m "Biolink cliente" && git push origin main`
2. En GitHub: **Settings → Pages → Source: GitHub Actions** (solo la primera vez).
3. Esperar el workflow `Deploy to GitHub Pages` (~1 min).
4. Opcional: dominio propio en Settings → Pages.

---

## 5. Entregar al cliente

- Link del biolink
- Usuario (`maria-nails`) y clave inicial
- Decirle: entrar a **Configurar** → el asistente de primer ingreso le pide su **WhatsApp** (obligatorio) y le deja **cambiar la clave**.

---

## 6. Revisión final (checklist)

- [ ] El biolink carga con el nombre y el idioma correctos
- [ ] La foto de perfil se ve (si no, revisar que sea `public/avatar.jpg`)
- [ ] Botón de WhatsApp abre el chat con el número correcto
- [ ] "Agendar horário / Agendar turno" abre el modal y manda al WhatsApp correcto
- [ ] `turnos.html` y `servicios.html` muestran los servicios del cliente
- [ ] Ningún link apunta a páginas que no existen o a redes de otro cliente
- [ ] Login con el usuario funciona y puede guardar cambios
- [ ] Una visita y un clic quedan registrados (estadísticas en el panel)
- [ ] Se instala como app (PWA) en el celular

---

## Configuración de una sola vez (ya hecha, revisar si cambia algo)

- `supabase/schema.sql` ejecutado en el proyecto (tablas, funciones, triggers, RLS). Es seguro volver a ejecutarlo.
- Authentication → Providers → Email: **desactivar "Allow new users to sign up"** (los usuarios los creás vos).

---

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| La foto de perfil no aparece | Falta `public/avatar.jpg` o tiene otro nombre/extensión | Subirlo exactamente como `public/avatar.jpg` y recargar con Ctrl+F5 |
| "Falta configurar Supabase (VITE_SUPABASE_URL...)" | El build se hizo sin las variables VITE_* | Poner las variables en el paso *Build* de `.github/workflows/deploy.yml` (ver paso 3) y hacer push |
| "Correo o contraseña incorrectos" | Usuario mal escrito o dominio distinto | Revisar que el correo en Supabase sea `usuario@<VITE_LOGIN_DOMAIN>` |
| "Este usuario no es el dueño del sitio" | `owner_id` null o de otro usuario, o `VITE_SITE_ID` equivocado | Verificar con el SELECT del paso 2; usar `create_site(...)` |
| El sitio muestra datos de otro cliente | `VITE_SITE_ID` quedó en `agencia` | Corregir `.env.production` y volver a publicar |
| No se guardan cambios | Sin sesión o no es dueño | Cerrar sesión, entrar de nuevo, revisar `owner_id` |
| Sitio sin cambios después de push | Caché del service worker (PWA) | Recargar forzado o esperar la actualización automática |

---

## Resetear la contraseña de un cliente (sin correo real)

En **SQL Editor**:
```sql
update auth.users
set encrypted_password = extensions.crypt('NUEVA_CLAVE', extensions.gen_salt('bf'))
where email = 'maria-nails@lavisualmk.alastecno.com';
```
Después decirle que entre con la nueva clave y la cambie desde el panel.

---

## Consultas útiles

Ver todos los sitios y sus dueños:
```sql
select site_id, owner_id, updated_at from public.sites order by site_id;
```

Ver usuarios creados:
```sql
select id, email, email_confirmed_at from auth.users order by created_at;
```

Visitas y clics de un sitio:
```sql
select kind, count(*) from public.analytics_events where site_id = 'maria-nails' group by kind;
```
