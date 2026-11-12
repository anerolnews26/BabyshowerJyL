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

## Paso 5 · Aviso por WhatsApp a tu número (interno, el invitado no lo ve)
Cada vez que alguien elige un regalo, el script te manda un WhatsApp a +573125447103 con "quién eligió qué". Usa CallMeBot, un servicio gratuito para uso personal:
1. Entra a **callmebot.com**, sección WhatsApp, y guarda en tus contactos el número del bot que aparezca ahí (cambia con el tiempo, usa el que diga la página).
2. Desde el WhatsApp del +573125447103 envíale exactamente: `I allow callmebot to send me messages`.
3. Espera la respuesta "API Activated... Your APIKEY is ...". Si no llega en 2 minutos, intenta de nuevo 24 horas después.
4. En Apps Script, en `Code.gs`, cambia `PEGA_AQUI_TU_APIKEY_DE_CALLMEBOT` por esa clave (entre las comillas) y guarda.
5. **Implementar → Administrar implementaciones → ✏️ editar → Versión: Nueva versión → Implementar**. La URL no cambia.

Notas: el invitado solo ve el mensaje de gracias; la clave queda dentro del script, no en la página. CallMeBot es un servicio gratuito y a veces se demora o falla; el correo a anerolnews@gmail.com y la hoja siempre quedan como respaldo.

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

## Si la página dice "No se pudo guardar" pero el regalo sí queda en la hoja
1. En Apps Script, pega la versión nueva de `Code.gs` y guarda.
2. Elige la función **autorizar** en el menú de arriba y pulsa **▶ Ejecutar**. Acepta los permisos (Avanzado → Ir a … → Permitir).
3. **Implementar → Administrar implementaciones → ✏️ editar → Versión: Nueva versión → Implementar.** (Sin este paso la web sigue usando el código viejo.)
4. Revisa que "Quién tiene acceso" sea **Cualquier persona**.
5. Sube el `index.html` nuevo y prueba de nuevo.

## Carrito de regalos (versión nueva)
- Cada regalo tiene **+ Agregar**; al agregarlo aparecen **− / + / 🗑** para cambiar la cantidad o borrarlo.
- Abajo aparece **🛒 N regalos · Ver y confirmar**. Allí el invitado revisa, escribe su nombre y pulsa **Listo ✔**; la página le pregunta **¿Confirmas tus regalos?** y al decir **Sí, confirmar** se guardan todos juntos.
- En tu hoja de Google aparece una columna nueva **Cantidad** (una fila por regalo). Las filas viejas sin cantidad cuentan como 1.
- Te llega **un solo correo** por persona con todos sus regalos.
- **Importante:** como cambió `Code.gs`, pégalo de nuevo en Apps Script y publica **Implementar → Administrar implementaciones → ✏️ editar → Nueva versión**. Luego sube el `index.html` nuevo.

## Cambiar cupos y limpiar pruebas
- **Más (o menos) disponibles**: en `index.html`, en la línea de ese regalo, cambia el número de `cupos:`; por ejemplo `cupos:10` → `cupos:20`. Sube el archivo de nuevo. No necesitas tocar la hoja.
- **Quitar las pruebas**: los disponibles se calculan con las filas de la hoja, así que al borrar la fila de prueba el cupo vuelve solo (la página se actualiza en unos 20 segundos). Puedes borrarlas a mano (clic derecho en el número de fila → Eliminar fila) o ejecutar `borrarPorNombre` (borra las filas con ese nombre) o `reiniciarTodo` (deja la hoja vacía) desde Apps Script.
- **Favicon**: los archivos `favicon.ico`, `favicon-32.png`, `favicon-192.png`, `favicon-512.png` y `apple-touch-icon.png` van en la misma carpeta que `index.html`.

## Asistencia en la hoja
- Cuando alguien confirma por WhatsApp, la página también guarda su asistencia en una pestaña nueva de tu hoja llamada **Asistencia** (Fecha, Nombre, Personas, Quién invitó, Día) y te llega un correo. La pestaña se crea sola al llegar la primera confirmación; no tienes que crear nada.
- En esa pestaña, la celda **H1** suma el total de personas.

## Volver los contadores a 0
- **Regalos:** hoja de Google → pestaña **Regalos** → clic en el número de la fila **2** → desplázate hasta la última fila, **Shift + clic** en su número → clic derecho → **Eliminar filas**. No borres la fila 1 (encabezados). Los cupos vuelven a su número original (el que dice `cupos:` en `index.html`) en máximo 20 segundos.
- **Asistencia:** igual en la pestaña **Asistencia** (conserva la fila 1).
- Solo borrar pruebas: filtra por el nombre de prueba y elimina esas filas.
