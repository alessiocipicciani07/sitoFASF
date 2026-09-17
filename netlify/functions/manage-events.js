// Funzione server per la dashboard "Gestione eventi".
// Riceve richieste dalla pagina gestione-eventi.html, verifica la password
// e aggiorna assets/data/eventi.json direttamente nel repository GitHub
// tramite le API di GitHub. Il commit fa poi ripartire da solo il deploy
// su Netlify, quindi l'evento appare sul sito pubblico in automatico.

const REPO_OWNER = "alessiocipicciani07";
const REPO_NAME = "sitoFASF";
const FILE_PATH = "assets/data/eventi.json";
const BRANCH = "main";

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Metodo non consentito" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return jsonResponse(400, { error: "Richiesta non valida" });
  }

  const { password, action, evento, id } = payload;

  if (!process.env.DASHBOARD_PASSWORD || password !== process.env.DASHBOARD_PASSWORD) {
    return jsonResponse(401, { error: "Password errata" });
  }

  const token = process.env.GH_TOKEN;
  if (!token) {
    return jsonResponse(500, { error: "Configurazione mancante (GH_TOKEN)" });
  }

  const apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "circoletto-fasf-dashboard",
  };

  let getRes;
  try {
    getRes = await fetch(`${apiBase}?ref=${BRANCH}`, { headers });
  } catch (e) {
    return jsonResponse(500, { error: "Errore di rete verso GitHub", detail: String(e) });
  }
  if (!getRes.ok) {
    const detail = await getRes.text();
    return jsonResponse(500, { error: "Impossibile leggere eventi.json", detail });
  }
  const getData = await getRes.json();
  const currentSha = getData.sha;
  const currentContent = Buffer.from(getData.content, "base64").toString("utf-8");

  let events;
  try {
    events = JSON.parse(currentContent);
  } catch (e) {
    events = [];
  }
  if (!Array.isArray(events)) events = [];

  let commitMessage;

  if (action === "create") {
    if (!evento || !evento.titolo || !evento.data_label) {
      return jsonResponse(400, { error: "Titolo e data sono obbligatori" });
    }
    const newId = "ev-" + Date.now().toString(36);
    events.push({
      id: newId,
      titolo: evento.titolo,
      data_label: evento.data_label,
      descrizione: evento.descrizione || "",
      posti: evento.posti || "",
      prezzo: evento.prezzo || "",
    });
    commitMessage = `Dashboard: aggiunge evento "${evento.titolo}"`;
  } else if (action === "update") {
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) return jsonResponse(404, { error: "Evento non trovato" });
    events[idx] = {
      ...events[idx],
      titolo: evento.titolo,
      data_label: evento.data_label,
      descrizione: evento.descrizione || "",
      posti: evento.posti || "",
      prezzo: evento.prezzo || "",
    };
    commitMessage = `Dashboard: modifica evento "${evento.titolo}"`;
  } else if (action === "delete") {
    const before = events.length;
    events = events.filter((e) => e.id !== id);
    if (events.length === before) {
      return jsonResponse(404, { error: "Evento non trovato" });
    }
    commitMessage = `Dashboard: rimuove evento ${id}`;
  } else {
    return jsonResponse(400, { error: "Azione non valida" });
  }

  const newContent = Buffer.from(JSON.stringify(events, null, 2) + "\n", "utf-8").toString("base64");

  let putRes;
  try {
    putRes = await fetch(apiBase, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: commitMessage,
        content: newContent,
        sha: currentSha,
        branch: BRANCH,
      }),
    });
  } catch (e) {
    return jsonResponse(500, { error: "Errore di rete verso GitHub", detail: String(e) });
  }

  if (!putRes.ok) {
    const detail = await putRes.text();
    return jsonResponse(500, { error: "Impossibile salvare su GitHub", detail });
  }

  return jsonResponse(200, { ok: true, events });
};
