// Pega este código en Google Apps Script (ver LEEME.md)
const OWNER_EMAIL = "anerolnews@gmail.com";   // aquí te llega el aviso
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

// Registra un regalo elegido, guarda el nombre en la hoja y te avisa por correo
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    const s = hoja_();
    const filas = s.getDataRange().getValues().slice(1);
    const usados = filas.filter(r => r[3] === d.gift).length;
    const cupos = Number(d.cupos) || 1;
    if (usados >= cupos) return json_({ ok: false, msg: "full" });
    const nombre = String(d.name || "").slice(0, 80);
    s.appendRow([new Date(), nombre, d.giftName, d.gift]);
    try {
      MailApp.sendEmail(OWNER_EMAIL, "🎁 Nuevo regalo elegido: " + d.giftName,
        nombre + " eligió: " + d.giftName + "\n\n" + (usados + 1) + " de " + cupos +
        " cupos de este regalo.\n\nLa lista completa está en tu hoja de Google.");
    } catch (x) {}
    return json_({ ok: true });
  } finally { lock.release(); }
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
