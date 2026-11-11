# 🚀 Guía de Despliegue en GitHub Pages (100% Gratis y Sin Servidor)

Esta aplicación es una SPA (Single Page Application) estática moderna construida con React, Vite y Tailwind CSS. **No necesitas pagar ningún servidor ni backend**.

---

## 🏢 Flujo de Trabajo para Agencia (Múltiples Clientes y Repositorios)

Para crear un BioLink único para cada cliente:
1. **Crea un nuevo repositorio en GitHub** para tu cliente (ej. `biolink-cliente1`) y copia estos archivos del proyecto.
2. **Personaliza el diseño visualmente** desde el panel de control de la app (enlaces, botones 3D, fotos, colores, redes y títulos).
3. Entra a la pestaña **Copia de Seguridad** y pulsa **"📥 Descargar clientConfig.json"** (o "Copiar Código JSON").
4. **Reemplaza el archivo `/src/data/clientConfig.json`** en el nuevo repositorio con el archivo descargado.
5. Haz `git commit` y `git push`:
   - El compilador Vite inyectará automáticamente los títulos, el manifest PWA, los links y el tema del cliente.
   - ¡Cualquier persona en cualquier teléfono o PC del mundo verá inmediatamente el BioLink personalizado del cliente!

---

## 📋 Opción 1: Despliegue Automático con GitHub Actions (Recomendado)

1. **Sube este proyecto a tu repositorio de GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Inicializar BioLink El Amor Traspasa PWA"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

2. **Crea el archivo de despliegue automático**:
   El proyecto ya incluye el flujo en `.github/workflows/deploy.yml`.

3. **Activa GitHub Pages en tu repositorio**:
   - Ve a tu repositorio en GitHub.
   - Haz clic en **Settings** (Configuración) > pestaña **Pages** (en el menú lateral izquierdo).
   - En **Build and deployment > Source**, selecciona **GitHub Actions**.
   - ¡Listo! En 1 minuto tu web estará publicada en:
     `https://TU_USUARIO.github.io/TU_REPOSITORIO/` (o en tu dominio personalizado como `home.elamortraspasa.com`).

---

## 📦 Opción 2: Despliegue Manual con `gh-pages`

1. Compila el proyecto localmente:
   ```bash
   npm run build
   ```
2. La carpeta resultante `dist` contiene los archivos listos para publicar en cualquier hosting estático:
   - **GitHub Pages**
   - **Vercel** (Importar con 1 clic desde GitHub)
   - **Netlify**
   - **Cloudflare Pages**

---

## 📱 Progressive Web App (PWA) e Instalabilidad

La aplicación ya está configurada con:
- Service Worker que guarda en caché los estilos, fuentes e iconos para funcionar **sin conexión a internet**.
- Manifiesto oficial PWA (`manifest.webmanifest`) con nombre, colores e iconos de 192px y 512px.
- Botón **"Instalar App"** integrado directamente en la cabecera y en el pie para que cualquier persona en **Android**, **iPhone**, **iPad** o **PC/Mac** pueda instalarla en su pantalla de inicio como una aplicación nativa.
