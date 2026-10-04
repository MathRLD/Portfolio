/* =====================================================
   Outil local : miniatures et anneau du hero
   ---------------------------------------------------
   Lancement : double-clic sur "Choisir les miniatures.bat"
   (ou `node _outils/miniatures.js` depuis la racine du site).
   Une page s'ouvre dans le navigateur sur http://localhost:4321.

   Ce que fait l'outil (les images sont converties en WebP par le
   navigateur, le serveur ne fait qu'écrire les fichiers) :
   - miniature de carte : assets/images/thumbs/<id>.webp, image entière
     en 1000px de large max ; champs cover (si l'image vient de la
     galerie), thumb (avec ?v=) et thumbPosition (cadrage) ;
   - vignette de l'anneau : assets/images/thumbs/hero/<id>.webp, déjà
     recadrée en 3:4 (480x640) ; champ heroThumb ;
   - projets de l'anneau : liste heroOrbit à la fin de projects-data.js ;
   - à chaque enregistrement, le ?v= de projects-data.js dans index.html
     change, pour que les navigateurs rechargent les données.

   Aucune dépendance : uniquement Node. Le dossier commence par "_",
   GitHub Pages ne le publie donc pas.
   ===================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { exec } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "js", "projects-data.js");
const INDEX_FILE = path.join(ROOT, "index.html");
const THUMBS_DIR = path.join(ROOT, "assets", "images", "thumbs");
const HERO_DIR = path.join(THUMBS_DIR, "hero");
const PORT = Number(process.env.PORT) || 4321;
const CATEGORIES = ["videos", "photos", "graphisme"];

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

/* ---------- lecture des données ---------- */
function readData() {
  const ctx = {};
  vm.runInNewContext(
    fs.readFileSync(DATA_FILE, "utf8") +
      "\n;this.projectsData = projectsData; this.heroOrbit = typeof heroOrbit !== 'undefined' ? heroOrbit : [];",
    ctx
  );
  return { projects: ctx.projectsData, heroOrbit: ctx.heroOrbit };
}

function findProject(projects, id) {
  for (const category of CATEGORIES) {
    const project = (projects[category] || []).find((p) => p.id === id);
    if (project) return project;
  }
  return null;
}

// Images de la galerie d'un projet (ou sa couverture seule).
function imagesOf(project) {
  const list = project.images && project.images.length ? project.images : [project.cover];
  const srcs = list.map((img) => (typeof img === "string" ? img : img.src));
  if (project.cover && !srcs.includes(project.cover)) srcs.unshift(project.cover);
  return srcs;
}

/* ---------- écriture de projects-data.js ---------- */
function fieldRegex(field) {
  return new RegExp(`^([ \\t]+)${field}: "[^"\\n]*",?[ \\t]*$`, "m");
}

// Remplace la valeur d'un champ texte dans le bloc d'un projet, ou
// l'ajoute après le premier champ existant de `after`.
function setField(block, field, value, after) {
  const json = JSON.stringify(value);
  if (fieldRegex(field).test(block)) {
    return block.replace(fieldRegex(field), (m, indent) => `${indent}${field}: ${json},`);
  }
  for (const anchorField of after) {
    const anchor = new RegExp(`^([ \\t]+)${anchorField}: [^\\n]*$`, "m");
    if (anchor.test(block)) return block.replace(anchor, (m, indent) => `${m}\n${indent}${field}: ${json},`);
  }
  throw new Error(`impossible de placer le champ ${field}`);
}

function removeField(block, field) {
  return block.replace(new RegExp(`\\n[ \\t]+${field}: "[^"\\n]*",?[ \\t]*(?=\\n)`), "");
}

function editProjectBlock(text, id, edit) {
  const idIndex = text.indexOf(`id: ${JSON.stringify(id)},`);
  if (idIndex < 0) throw new Error(`projet ${id} introuvable dans projects-data.js`);
  const start = text.lastIndexOf("{", idIndex);
  const end = text.indexOf("\n    }", idIndex);
  return text.slice(0, start) + edit(text.slice(start, end)) + text.slice(end);
}

function setHeroOrbit(text, ids) {
  const list = "[\n" + ids.map((id) => `  ${JSON.stringify(id)}`).join(",\n") + "\n]";
  const re = /const heroOrbit = \[[\s\S]*?\];/;
  if (re.test(text)) return text.replace(re, `const heroOrbit = ${list};`);
  return text.replace(/\s*$/, `\n\nconst heroOrbit = ${list};\n`);
}

function writeData(text) {
  new vm.Script(text); // garde-fou : le fichier doit rester du JavaScript valide
  fs.writeFileSync(DATA_FILE, text);
}

function bumpDataVersion(version) {
  const html = fs.readFileSync(INDEX_FILE, "utf8");
  const next = html.replace(/(js\/projects-data\.js\?v=)[^"]*/, `$1${version}`);
  if (next !== html) fs.writeFileSync(INDEX_FILE, next);
}

function timestamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function webpBuffer(dataUrl) {
  const match = /^data:image\/webp;base64,(.+)$/.exec(dataUrl || "");
  if (!match) throw new Error("Image WebP manquante (navigateur trop ancien ?).");
  return Buffer.from(match[1], "base64");
}

function checkPosition(position) {
  if (!/^\d{1,3}(\.\d+)?% \d{1,3}(\.\d+)?%$/.test(position || "")) throw new Error("Cadrage invalide.");
}

/* ---------- enregistrement d'un projet ----------
   corps : { id, card?, hero?, inOrbit? }
   card : { kind: "current" | "gallery" | "upload", src?, position, image? }
   hero : { mode: "same" } | { mode: "custom", image } */
function saveProject(body) {
  const { projects, heroOrbit } = readData();
  const project = findProject(projects, body.id);
  if (!project) throw new Error(`Projet inconnu : ${body.id}`);
  const version = timestamp();
  let text = fs.readFileSync(DATA_FILE, "utf8");
  const done = [];

  if (body.card) {
    const { kind, src, position, image } = body.card;
    checkPosition(position);
    if (kind === "gallery" && !imagesOf(project).includes(src)) throw new Error("Cette image n'appartient pas au projet.");
    if (kind === "gallery" || kind === "upload") {
      fs.mkdirSync(THUMBS_DIR, { recursive: true });
      fs.writeFileSync(path.join(THUMBS_DIR, `${project.id}.webp`), webpBuffer(image));
    }
    text = editProjectBlock(text, project.id, (block) => {
      if (kind === "gallery") block = setField(block, "cover", src, ["description"]);
      if (kind !== "current") block = setField(block, "thumb", `assets/images/thumbs/${project.id}.webp?v=${version}`, ["cover"]);
      block = position === "50% 50%"
        ? removeField(block, "thumbPosition")
        : setField(block, "thumbPosition", position, ["thumb", "cover"]);
      return block;
    });
    done.push(`miniature ${kind === "upload" ? "importée" : kind === "gallery" ? path.basename(src) : "recadrée"} (${position})`);
  }

  if (body.hero) {
    const heroFile = path.join(HERO_DIR, `${project.id}.webp`);
    if (body.hero.mode === "custom") {
      fs.mkdirSync(HERO_DIR, { recursive: true });
      fs.writeFileSync(heroFile, webpBuffer(body.hero.image));
      text = editProjectBlock(text, project.id, (block) =>
        setField(block, "heroThumb", `assets/images/thumbs/hero/${project.id}.webp?v=${version}`, ["thumbPosition", "thumb", "cover"])
      );
      done.push("vignette de l'anneau");
    } else {
      text = editProjectBlock(text, project.id, (block) => removeField(block, "heroThumb"));
      if (fs.existsSync(heroFile)) fs.unlinkSync(heroFile);
      done.push("vignette de l'anneau = miniature");
    }
  }

  if (typeof body.inOrbit === "boolean") {
    const has = heroOrbit.includes(project.id);
    if (body.inOrbit && !has) text = setHeroOrbit(text, [...heroOrbit, project.id]);
    if (!body.inOrbit && has) text = setHeroOrbit(text, heroOrbit.filter((id) => id !== project.id));
    if (body.inOrbit !== has) done.push(body.inOrbit ? "ajouté à l'anneau" : "retiré de l'anneau");
  }

  writeData(text);
  bumpDataVersion(version);
  console.log(`✓ ${project.title} : ${done.join(", ") || "rien à changer"}`);
}

function saveOrbit(body) {
  const { projects } = readData();
  const ids = body.ids;
  if (!Array.isArray(ids) || ids.some((id) => !findProject(projects, id))) throw new Error("Liste de projets invalide.");
  writeData(setHeroOrbit(fs.readFileSync(DATA_FILE, "utf8"), [...new Set(ids)]));
  bumpDataVersion(timestamp());
  console.log(`✓ Anneau du hero : ${ids.length} projets`);
}

/* ---------- serveur ---------- */
function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 40 * 1024 * 1024) reject(new Error("Envoi trop lourd."));
      else chunks.push(c);
    });
    req.on("end", () => resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")));
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (urlPath === "/") urlPath = "/_outils/miniatures.html";
  const file = path.resolve(ROOT, "." + urlPath);
  if (!file.startsWith(ROOT + path.sep)) return send(res, 403, "Interdit", "text/plain");
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, "Introuvable", "text/plain; charset=utf-8");
    send(res, 200, buf, TYPES[path.extname(file).toLowerCase()] || "application/octet-stream");
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const route = `${req.method} ${req.url}`;
    if (route === "GET /api/data") return send(res, 200, readData());
    if (route === "POST /api/project") { saveProject(await readBody(req)); return send(res, 200, { ok: true }); }
    if (route === "POST /api/orbit") { saveOrbit(await readBody(req)); return send(res, 200, { ok: true }); }
    if (req.method === "GET") return serveStatic(req, res);
    send(res, 405, "Méthode non gérée", "text/plain; charset=utf-8");
  } catch (err) {
    console.error("✗", err.message);
    send(res, 400, { error: err.message });
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") console.log(`L'outil tourne déjà : ouvre http://localhost:${PORT}`);
  else console.error(err);
  process.exit(1);
});

server.listen(PORT, "127.0.0.1", () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Outil des miniatures : ${url}`);
  console.log("Laisse cette fenêtre ouverte pendant que tu l'utilises, ferme-la pour l'arrêter.");
  if (!process.env.NO_OPEN) {
    const opener = process.platform === "win32" ? `start "" "${url}"` : process.platform === "darwin" ? `open "${url}"` : `xdg-open "${url}"`;
    exec(opener);
  }
});
