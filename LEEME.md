# 🐳 Baby Shower · Fondo del Mar — paquete para subir a internet

## Qué hay en esta carpeta
- `index.html` → la página completa (todo el código está aquí; se edita con cualquier editor de texto).
- `images/animales/` y `images/buzos/` → los animales y la familia de buzos.
- `images/regalos/` → una foto por regalo. **Para cambiar una foto, reemplaza el archivo con el mismo nombre** (por ejemplo `cuna.jpg`).
- `apps-script/Code.gs` → el código que guarda los nombres en una hoja de Google y te avisa por correo.
- `invitaciones/` → la tarjeta para amigos (JPG y PDF).

## Paso 1 · Crear la hoja y el aviso por correo (gratis, 10 minutos)
1. Entra con la cuenta de Google donde quieres guardar la lista y abre **sheets.new** (hoja nueva). Ponle de nombre "Lista regalos baby shower".
2. Menú **Extensiones → Apps Script**.
3. Borra lo que aparezca, pega todo el contenido de `apps-script/Code.gs` y pulsa el icono de guardar.
4. Arriba a la derecha: **Implementar → Nueva implementación**. En el engranaje elige **Aplicación web**.
   - *Ejecutar como*: **Yo**.
   - *Quién tiene acceso*: **Cualquier persona**.
5. Pulsa **Implementar** y autoriza los permisos (Google avisa "app no verificada": **Avanzado → Ir a … (no seguro)** es normal, porque es tu propio script).
6. Copia la **URL de la aplicación web** (termina en `/exec`).

Los nombres quedan en la pestaña **Regalos** de tu hoja (solo tú la ves) y cada vez que alguien elige un regalo te llega un correo a anerolnews@gmail.com. Los invitados nunca ven nombres, solo cuántos cupos quedan.

## Paso 2 · Conectar la página con la hoja
Abre `index.html`, busca esta línea (cerca del inicio del `<script>`):

    api: "",

y pega la URL entre las comillas:

    api: "https://script.google.com/macros/s/XXXXXXXX/exec",

## Paso 3 · Subir la carpeta a internet (gratis)
Sube **toda la carpeta** (con `index.html` e `images`). Cualquiera de estas opciones es gratis y no vence a los 2 meses:

**Opción A · Netlify (la más fácil)**
1. Crea una cuenta gratis en netlify.com.
2. En "Sites" busca **Add new site → Deploy manually** y arrastra la carpeta.
3. Te da un enlace tipo `https://tunombre.netlify.app`. Puedes cambiar el nombre en *Site settings → Change site name*.

**Opción B · Cloudflare Pages**
1. Cuenta gratis en pages.cloudflare.com → **Create a project → Direct Upload**.
2. Sube la carpeta; te da `https://tunombre.pages.dev`.

**Opción C · GitHub Pages**
1. Cuenta gratis en github.com → nuevo repositorio público.
2. Sube los archivos (Add file → Upload files).
3. *Settings → Pages* → rama `main` → te da `https://usuario.github.io/repositorio`.

(Los menús de estas páginas cambian de vez en cuando, pero el proceso es siempre "subir carpeta y recibir un enlace".)

## Paso 4 · Probar antes de compartir
1. Abre el enlace desde tu celular y elige un regalo de prueba.
2. Revisa que llegó el correo y que aparece la fila en la hoja.
3. Borra la fila de prueba en la hoja para liberar el cupo.

## Cómo editar después
- **Regalos, textos, hora, lugar, contactos**: en `index.html`, bloque `✏️ EDITA AQUÍ` (CONFIG y REGALOS). Cada regalo es una línea: nombre, cupos, nota y link de sugerencia.
- **Marcar un regalo como ya elegido**: agrega `fijo:true` (o `fijo:"Reservado"`) a su línea.
- **Liberar un cupo** (alguien se arrepiente): borra su fila en la hoja de Google.
- **Cambiar una foto**: reemplaza el archivo en `images/regalos/` con el mismo nombre.
- Si cambias el `id` de un regalo, pierde las reservas que ya tenía.

## Importante
- Si cambias el código de `Code.gs`, debes hacer **Implementar → Administrar implementaciones → editar → Nueva versión**; la URL sigue igual.
- Los cupos de cada regalo se envían desde la página; para que nadie los pueda alterar, no compartas el archivo `index.html` editable.
