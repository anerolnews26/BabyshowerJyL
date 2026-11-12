// Pega este código en Google Apps Script (ver LEEME.md)
const OWNER_EMAIL = "anerolnews@gmail.com";        // aquí te llega el aviso por correo
const ACTIVAR_WHATSAPP = false;                    // cámbialo a true cuando tengas la clave de CallMeBot
const WA_PHONE   = "+573125447103";                // tu WhatsApp (aviso interno)
const WA_APIKEY  = "PEGA_AQUI_TU_APIKEY_DE_CALLMEBOT";
const HOJA = "Regalos";

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(HOJA);
  if (!s) { s = ss.insertSheet(HOJA); s.appendRow(["Fecha", "Nombre", "Regalo", "ID", "Cantidad"]); }
  if (!s.getRange(1, 5).getValue()) s.getRange(1, 5).setValue("Cantidad");
  return s;
}

function hojaAsis_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName("Asistencia");
  if (!s) {
    s = ss.insertSheet("Asistencia");
    s.appendRow(["Fecha", "Nombre", "Personas", "Quién invitó", "Día"]);
    s.getRange("G1").setValue("Total personas");
    s.getRange("H1").setFormula("=SUM(C2:C)");
  }
  return s;
}

// Suma las unidades elegidas por regalo (las filas viejas sin cantidad cuentan como 1)
function usados_(filas) {
  const c = {};
  filas.forEach(r => { c[r[3]] = (c[r[3]] || 0) + (Number(r[4]) || 1); });
  return c;
}

// La página pide solo CUÁNTOS cupos hay usados por regalo (nunca los nombres)
function doGet(e) {
  const filas = hoja_().getDataRange().getValues().slice(1);
  return json_({ counts: usados_(filas) });
}

// Registra los regalos del carrito, guarda el nombre en la hoja y te avisa por correo.
// Siempre responde un JSON válido, pase lo que pase con los avisos.
function doPost(e) {
  const lock = LockService.getScriptLock();
  let respuesta = { ok: false, msg: "error", saved: [], full: [] };
  let aviso = null;
  let avisoAsis = null;
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents);
    const nombre = String(d.name || "").slice(0, 80);
    if (d.tipo === "asistencia") {
      const personas = Math.max(1, Math.min(30, Number(d.personas) || 1));
      const invito = String(d.invito || "").slice(0, 60);
      const dia = String(d.dia || "").slice(0, 40);
      hojaAsis_().appendRow([new Date(), nombre, personas, invito, dia]);
      avisoAsis = { nombre: nombre, personas: personas, invito: invito, dia: dia };
      respuesta = { ok: true, saved: [], full: [] };
      return finalizar_(respuesta, aviso, avisoAsis, lock);
    }
    const items = (d.items || [{ gift: d.gift, giftName: d.giftName, cupos: d.cupos, qty: 1 }]).slice(0, 40);
    const s = hoja_();
    const c = usados_(s.getDataRange().getValues().slice(1));
    const saved = [], full = [], resumen = [];
    items.forEach(it => {
      const cupos = Number(it.cupos) || 1;
      const qty = Math.max(1, Math.floor(Number(it.qty) || 1));
      const u = c[it.gift] || 0;
      if (u + qty > cupos) { full.push(it.gift); return; }
      s.appendRow([new Date(), nombre, String(it.giftName || it.gift).slice(0, 120), it.gift, qty]);
      c[it.gift] = u + qty;
      saved.push(it.gift);
      resumen.push("• " + it.giftName + " ×" + qty + " (" + (u + qty) + " de " + cupos + ")");
    });
    respuesta = { ok: saved.length > 0, saved: saved, full: full, msg: saved.length ? "" : "full" };
    if (saved.length) aviso = { nombre: nombre, resumen: resumen };
  } catch (err) {
    respuesta = { ok: false, msg: "error: " + err, saved: [], full: [] };
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
  return finalizar_(respuesta, aviso, avisoAsis, null);
}

// Avisos por correo (y WhatsApp si lo activas) y respuesta final
function finalizar_(respuesta, aviso, avisoAsis, lock) {
  if (lock) { try { lock.releaseLock(); } catch (x) {} }
  if (avisoAsis) {
    try {
      MailApp.sendEmail(OWNER_EMAIL, "✅ Asistencia: " + avisoAsis.nombre,
        avisoAsis.nombre + " confirmó asistencia (" + avisoAsis.dia + ")\nPersonas: " + avisoAsis.personas +
        "\nInvitó: " + avisoAsis.invito + "\n\nLa lista completa está en la pestaña Asistencia de tu hoja de Google.");
    } catch (x) {}
  }
  if (aviso) {
    const texto = "🎁 " + aviso.nombre + " eligió:\n" + aviso.resumen.join("\n");
    try {
      MailApp.sendEmail(OWNER_EMAIL, "🎁 " + aviso.nombre + " eligió regalo(s)",
        texto + "\n\nLa lista completa está en tu hoja de Google.");
    } catch (x) {}
    if (ACTIVAR_WHATSAPP) {
      try {
        UrlFetchApp.fetch("https://api.callmebot.com/whatsapp.php?phone=" + encodeURIComponent(WA_PHONE) +
          "&text=" + encodeURIComponent(texto) + "&apikey=" + encodeURIComponent(WA_APIKEY),
          { muteHttpExceptions: true });
      } catch (x) {}
    }
  }
  return json_(respuesta);
}

// ---- LIMPIEZA (se ejecutan a mano desde el editor, con el botón ▶; no hace falta publicar nueva versión) ----
// Borra de la hoja todas las filas cuyo NOMBRE contenga este texto (ej. "prueba"). Cambia el texto y ejecuta.
function borrarPorNombre() {
  const TEXTO = "prueba";
  const s = hoja_(); const v = s.getDataRange().getValues();
  for (let i = v.length - 1; i >= 1; i--) {
    if (String(v[i][1]).toLowerCase().indexOf(TEXTO.toLowerCase()) >= 0) s.deleteRow(i + 1);
  }
}
// CUIDADO: borra TODAS las filas de regalos (todo vuelve a su cupo original). Úsalo antes de compartir la página.
function reiniciarTodo() {
  const s = hoja_();
  if (s.getLastRow() > 1) s.deleteRows(2, s.getLastRow() - 1);
}

// Ejecuta esta función UNA vez desde el editor (botón ▶) para aceptar los permisos
// de la hoja y del correo. Después publica una "Nueva versión" (ver LEEME.md).
function autorizar() {
  SpreadsheetApp.getActiveSpreadsheet().getName();
  MailApp.getRemainingDailyQuota();
  LockService.getScriptLock();
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
