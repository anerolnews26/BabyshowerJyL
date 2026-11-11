// Pega este código en Google Apps Script (ver LEEME.md)
const OWNER_EMAIL = "anerolnews@gmail.com";        // aquí te llega el aviso por correo
const WA_PHONE   = "+573125447103";                // tu WhatsApp (aviso interno)
const WA_APIKEY  = "PEGA_AQUI_TU_APIKEY_DE_CALLMEBOT";  // ver LEEME.md, paso 5
const HOJA = "Regalos";

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(HOJA);
  if (!s) { s = ss.insertSheet(HOJA); s.appendRow(["Fecha", "Nombre", "Regalo", "ID"]); }
  return s;
}

// La página pide solo CUÁNTOS cupos hay usados por regalo (nunca los nombres)
function doGet(e) {
  const filas = hoja_().getDataRange().getValues().slice(1);
  const counts = {};
  filas.forEach(r => { counts[r[3]] = (counts[r[3]] || 0) + 1; });
  return json_({ counts: counts });
}

// Registra el regalo, guarda el nombre en la hoja y te avisa por correo y WhatsApp.
// El invitado solo ve el mensaje de gracias; los avisos son internos.
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  let aviso = null;
  try {
    const d = JSON.parse(e.postData.contents);
    const s = hoja_();
    const filas = s.getDataRange().getValues().slice(1);
    const usados = filas.filter(r => r[3] === d.gift).length;
    const cupos = Number(d.cupos) || 1;
    if (usados >= cupos) return json_({ ok: false, msg: "full" });
    const nombre = String(d.name || "").slice(0, 80);
    s.appendRow([new Date(), nombre, d.giftName, d.gift]);
    aviso = { nombre: nombre, regalo: d.giftName, n: usados + 1, cupos: cupos };
  } finally { lock.release(); }

  if (aviso) {
    const texto = "🎁 " + aviso.nombre + " eligió: " + aviso.regalo + " (" + aviso.n + " de " + aviso.cupos + ")";
    try { MailApp.sendEmail(OWNER_EMAIL, "🎁 Nuevo regalo elegido: " + aviso.regalo,
      texto + "\n\nLa lista completa está en tu hoja de Google."); } catch (x) {}
    avisoWhatsApp_(texto);
  }
  return json_({ ok: true });
}

// Aviso por WhatsApp con CallMeBot (gratis, solo a tu propio número)
function avisoWhatsApp_(texto) {
  if (!WA_APIKEY || WA_APIKEY.indexOf("PEGA") === 0) return;
  try {
    UrlFetchApp.fetch("https://api.callmebot.com/whatsapp.php?phone=" + encodeURIComponent(WA_PHONE) +
      "&text=" + encodeURIComponent(texto) + "&apikey=" + encodeURIComponent(WA_APIKEY),
      { muteHttpExceptions: true });
  } catch (x) {}
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
