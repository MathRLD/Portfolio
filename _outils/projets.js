/* =====================================================
   Outil local de gestion des projets
   ---------------------------------------------------
   Lancement : double-clic sur "Gérer les projets.bat"
   (ou `node _outils/projets.js` depuis la racine du site).
   Une page s'ouvre dans le navigateur sur http://localhost:4321.

   Ce que fait l'outil (les images sont redimensionnées et converties par
   le navigateur, le serveur ne fait qu'écrire les fichiers) :
   - projets : création et modification des textes, du lien vidéo, de la
     couverture des vidéos et de la galerie des photos / graphisme ;
     chaque projet est réécrit en entier dans projects-data.js ;
   - archivage : champ archived (le site ignore ces projets), restaurable ;
   - images de galerie et couvertures : 2000px max sur le grand côté, en
     JPEG (WebP si l'image a de la transparence), dans le dossier des
     autres images du projet ou assets/images/<section>/<id>/ ;
   - miniature de carte : assets/images/thumbs/<id>.webp, image entière
     en 1000px de large max ; champs cover (si l'image vient de la
     galerie), thumb (avec ?v=) et thumbPosition (cadrage) ;
   - vignette de l'anneau : assets/images/thumbs/hero/<id>.webp, déjà
     recadrée en 3:4 (480x640) ; champ heroThumb ;
   - ordre des carrousels : ordre des projets dans les tableaux videos,
     photos et graphisme de projects-data.js ;
   - projets de l'anneau : liste heroOrbit à la fin de projects-data.js ;
   - à chaque enregistrement, le ?v= de projects-data.js dans index.html
     change, pour que les navigateurs rechargent les données ;
   - publication : git add -A, commit et push, depuis le bouton Publier.

   Aucune dépendance : uniquement Node. Le dossier commence par "_",
   GitHub Pages ne le publie donc pas.
   ===================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { exec, execFile } = require("child_process");

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

/* ---------- écriture de projects-data.js ----------
   Un projet est toujours réécrit en entier à partir de son objet, dans le
   format du fichier : un champ par ligne, une image de galerie par ligne. */
const FIELD_ORDER = ["id", "archived", "title", "client", "description", "cover", "thumb", "thumbPosition", "heroThumb", "tags", "media", "images"];
const PROJECT_BLOCK = /^    \{[\s\S]*?^    \}/gm;

function inlineValue(value) {
  if (Array.isArray(value)) return `[${value.map(inlineValue).join(", ")}]`;
  if (value && typeof value === "object") {
    return `{ ${Object.entries(value).map(([k, v]) => `${k}: ${inlineValue(v)}`).join(", ")} }`;
  }
  return JSON.stringify(value);
}

function formatProject(project) {
  const rank = (k) => (FIELD_ORDER.includes(k) ? FIELD_ORDER.indexOf(k) : FIELD_ORDER.length);
  const keys = Object.keys(project).filter((k) => project[k] !== undefined).sort((a, b) => rank(a) - rank(b));
  const lines = keys.map((k) =>
    k === "images" && project.images.length
      ? `      images: [\n${project.images.map((img) => `        ${inlineValue(img)}`).join(",\n")}\n      ]`
      : `      ${k}: ${inlineValue(project[k])}`
  );
  return `    {\n${lines.join(",\n")}\n    }`;
}

function categoryRange(text, category) {
  const start = text.indexOf(`\n  ${category}: [`);
  const end = text.indexOf("\n  ]", start);
  if (start < 0 || end < 0) throw new Error(`tableau ${category} introuvable dans projects-data.js`);
  return { start, end };
}

function blockId(block) {
  const id = /^      id: ("[^"\n]*"),/m.exec(block);
  return id ? JSON.parse(id[1]) : null;
}

// Remplace le bloc du projet, ou l'ajoute à la fin de sa section.
function writeProjectBlock(text, category, project) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const block = formatProject(project).replace(/\n/g, eol);
  const { start, end } = categoryRange(text, category);
  const blocks = [...text.slice(start, end).matchAll(PROJECT_BLOCK)];
  const current = blocks.find((m) => blockId(m[0]) === project.id);
  if (current) {
    const at = start + current.index;
    return text.slice(0, at) + block + text.slice(at + current[0].length);
  }
  const last = blocks[blocks.length - 1];
  const at = last ? start + last.index + last[0].length : text.indexOf("[", start) + 1;
  return text.slice(0, at) + (last ? "," : "") + eol + block + text.slice(at);
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

// Photo de galerie ou couverture, déjà redimensionnée par le navigateur :
// JPEG, ou WebP si elle a de la transparence.
function imageBuffer(dataUrl) {
  const match = /^data:image\/(jpeg|webp);base64,(.+)$/.exec(dataUrl || "");
  if (!match) throw new Error("Image manquante ou dans un format inattendu.");
  return { buffer: Buffer.from(match[2], "base64"), ext: match[1] === "jpeg" ? ".jpg" : ".webp" };
}

function checkPosition(position) {
  if (!/^\d{1,3}(\.\d+)?% \d{1,3}(\.\d+)?%$/.test(position || "")) throw new Error("Cadrage invalide.");
}

const cleanText = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

function slugify(text, fallback) {
  const slug = String(text).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function uniqueId(projects, base) {
  const taken = new Set(CATEGORIES.flatMap((c) => (projects[c] || []).map((p) => p.id)));
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  return id;
}

// Chemin libre (relatif à la racine du site) : un fichier existant n'est
// jamais écrasé, ce qui évite aussi les images périmées en cache.
function freeFile(dir, name, ext, reserved) {
  const base = slugify(path.parse(String(name || "")).name, "image");
  let file = `${dir}/${base}${ext}`;
  for (let n = 2; reserved.has(file) || fs.existsSync(path.join(ROOT, file)); n++) file = `${dir}/${base}-${n}${ext}`;
  reserved.add(file);
  return file;
}

// Dossier des nouvelles images : celui des images déjà dans la galerie,
// sinon assets/images/<section>/<id>.
function galleryDir(project, category) {
  const first = (project.images || [])[0];
  const dir = first && path.posix.dirname(typeof first === "string" ? first : first.src);
  return dir && dir.startsWith("assets/images/") ? dir : `assets/images/${category}/${project.id}`;
}

function cleanMedia(media) {
  const { type, src, vertical } = media || {};
  const ok = (type === "youtube" && /^[\w-]{11}$/.test(src))
    || (type === "vimeo" && /^\d+$/.test(src))
    || (type === "file" && typeof src === "string" && src);
  if (!ok) throw new Error("Lien vidéo invalide : colle un lien YouTube ou Vimeo.");
  return vertical ? { type, src, vertical: true } : { type, src };
}

/* ---------- enregistrement d'un projet ----------
   corps : { id | create: { category }, archived?, info?, media?, cover?, gallery?, card?, hero?, inOrbit? }
   archived : true retire le projet du site (et de l'anneau) sans le supprimer
   info : { title, client, description, tags: [] }
   media (vidéos) : { type: "youtube" | "vimeo", src, vertical? }
   cover (vidéos) : { name, image } nouvelle image de couverture de la popup
   gallery (photos, graphisme) : la liste complète, dans l'ordre :
     { src, alt } image déjà là | { name, image, alt } nouvelle image
   card : { kind: "current" | "gallery" | "upload", position, image?,
            et pour "gallery" : src | galleryIndex | fromCover }
   hero : { mode: "same" } | { mode: "custom", image }
   Rien n'est écrit tant que tout n'a pas été vérifié. */
function saveProject(body) {
  const { projects, heroOrbit } = readData();
  const version = timestamp();
  const writes = []; // [chemin relatif, contenu]
  const reserved = new Set();
  const done = [];
  let category, project;

  if (body.create) {
    category = body.create.category;
    if (!CATEGORIES.includes(category)) throw new Error("Section inconnue.");
    const id = uniqueId(projects, slugify(cleanText(body.info && body.info.title, 200), "projet"));
    project = { id, title: "", client: "", description: "", cover: "", tags: [] };
    if (category === "videos") project.media = { type: "youtube", src: "" };
    else project.images = [];
  } else {
    category = CATEGORIES.find((c) => (projects[c] || []).some((p) => p.id === body.id));
    if (!category) throw new Error(`Projet inconnu : ${body.id}`);
    project = JSON.parse(JSON.stringify(findProject(projects, body.id)));
  }
  const id = project.id;

  if (typeof body.archived === "boolean") {
    if (body.create) throw new Error("Un nouveau projet ne peut pas être archivé.");
    if (body.archived) project.archived = true;
    else delete project.archived;
    done.push(body.archived ? "archivé" : "restauré");
  }

  if (body.info) {
    const { title, client, description, tags } = body.info;
    project.title = cleanText(title, 200);
    project.client = cleanText(client, 200);
    project.description = cleanText(description, 3000);
    project.tags = (Array.isArray(tags) ? tags : []).map((t) => cleanText(t, 60)).filter(Boolean);
    if (!project.title) throw new Error("Le titre est obligatoire.");
    done.push("textes");
  }

  if (body.media) {
    if (category !== "videos") throw new Error("Seuls les projets vidéo ont un lien vidéo.");
    project.media = cleanMedia(body.media);
    done.push("lien vidéo");
  }

  if (body.cover) {
    const { buffer, ext } = imageBuffer(body.cover.image);
    project.cover = freeFile("assets/images/videos", `${id}-cover`, ext, reserved);
    writes.push([project.cover, buffer]);
    done.push("couverture");
  }

  if (body.gallery) {
    if (category === "videos") throw new Error("Les projets vidéo n'ont pas de galerie.");
    const dir = galleryDir(project, category);
    const known = new Set(imagesOf(project));
    let added = 0;
    project.images = body.gallery.map((item) => {
      const alt = cleanText(item.alt, 300) || project.title;
      if (item.image) {
        const { buffer, ext } = imageBuffer(item.image);
        const file = freeFile(dir, item.name, ext, reserved);
        writes.push([file, buffer]);
        added++;
        return { src: file, alt };
      }
      if (!known.has(item.src)) throw new Error("Image de galerie inconnue : recharge la page.");
      return { src: item.src, alt };
    });
    if (!project.images.length) throw new Error("La galerie doit garder au moins une image.");
    done.push(`galerie (${project.images.length} images${added ? `, ${added} ajoutées` : ""})`);
  }

  if (body.card) {
    const { kind, position, image } = body.card;
    checkPosition(position);
    if (kind === "gallery") {
      const picked = Number.isInteger(body.card.galleryIndex) ? (project.images || [])[body.card.galleryIndex] : null;
      const src = body.card.fromCover ? project.cover : picked ? (typeof picked === "string" ? picked : picked.src) : body.card.src;
      if (!src || !imagesOf(project).includes(src)) throw new Error("Cette image n'appartient pas au projet.");
      project.cover = src;
    }
    if (kind === "gallery" || kind === "upload") {
      writes.push([`assets/images/thumbs/${id}.webp`, webpBuffer(image)]);
      project.thumb = `assets/images/thumbs/${id}.webp?v=${version}`;
    }
    if (position === "50% 50%") delete project.thumbPosition;
    else project.thumbPosition = position;
    done.push(`miniature (${position})`);
  }

  let removeHero = false;
  if (body.hero) {
    if (body.hero.mode === "custom") {
      writes.push([`assets/images/thumbs/hero/${id}.webp`, webpBuffer(body.hero.image)]);
      project.heroThumb = `assets/images/thumbs/hero/${id}.webp?v=${version}`;
      done.push("vignette de l'anneau");
    } else {
      delete project.heroThumb;
      removeHero = true;
      done.push("vignette de l'anneau = miniature");
    }
  }

  if (body.create) {
    if (category === "videos" && !project.media.src) throw new Error("Ajoute le lien de la vidéo.");
    if (category === "videos" && !project.cover) throw new Error("Ajoute une image de couverture.");
    if (category !== "videos" && !project.images.length) throw new Error("Ajoute au moins une image.");
    if (!project.cover) project.cover = project.images[0].src;
  }

  let text = writeProjectBlock(fs.readFileSync(DATA_FILE, "utf8"), category, project);
  const inOrbit = project.archived ? false : body.inOrbit; // un projet archivé quitte l'anneau
  if (typeof inOrbit === "boolean") {
    const has = heroOrbit.includes(id);
    if (inOrbit && !has) text = setHeroOrbit(text, [...heroOrbit, id]);
    if (!inOrbit && has) text = setHeroOrbit(text, heroOrbit.filter((x) => x !== id));
    if (inOrbit !== has) done.push(inOrbit ? "ajouté à l'anneau" : "retiré de l'anneau");
  }
  new vm.Script(text); // garde-fou avant d'écrire quoi que ce soit

  for (const [file, buffer] of writes) {
    fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, file), buffer);
  }
  const heroFile = path.join(HERO_DIR, `${id}.webp`);
  if (removeHero && fs.existsSync(heroFile)) fs.unlinkSync(heroFile);
  writeData(text);
  bumpDataVersion(version);

  const reread = findProject(readData().projects, id);
  if (!reread || formatProject(reread) !== formatProject(project)) {
    throw new Error("Le projet relu ne correspond pas à ce qui a été enregistré : vérifie js/projects-data.js.");
  }
  console.log(`✓ ${project.title}${body.create ? " (nouveau projet)" : ""} : ${done.join(", ") || "rien à changer"}`);
  return { id };
}

// Image de couverture d'une vidéo YouTube, relayée pour que la page de
// l'outil puisse la redimensionner (le navigateur ne peut pas lire une image
// d'un autre site dans un canvas).
async function youtubeCover(id) {
  if (!/^[\w-]{11}$/.test(id || "")) throw new Error("Identifiant YouTube invalide.");
  for (const size of ["maxresdefault", "sddefault", "hqdefault"]) {
    const res = await fetch(`https://i.ytimg.com/vi/${id}/${size}.jpg`).catch(() => null);
    if (res && res.ok) return Buffer.from(await res.arrayBuffer());
  }
  throw new Error("Impossible de récupérer l'image YouTube (vérifie le lien ou ta connexion).");
}

function saveOrbit(body) {
  const { projects } = readData();
  const ids = body.ids;
  if (!Array.isArray(ids) || ids.some((id) => !findProject(projects, id))) throw new Error("Liste de projets invalide.");
  if (ids.some((id) => findProject(projects, id).archived)) throw new Error("Un projet archivé ne peut pas être dans l'anneau.");
  writeData(setHeroOrbit(fs.readFileSync(DATA_FILE, "utf8"), [...new Set(ids)]));
  bumpDataVersion(timestamp());
  console.log(`✓ Anneau du hero : ${ids.length} projets`);
}

/* ---------- ordre des carrousels ----------
   corps : { order: { videos: [ids], photos: [ids], graphisme: [ids] } }
   Les blocs des projets sont permutés dans leur tableau ; ce qui les
   sépare (virgules, commentaires) reste en place. */
function reorderCategory(text, category, ids) {
  const { start, end } = categoryRange(text, category);
  const body = text.slice(start, end);
  const blocks = new Map();
  for (const [block] of body.matchAll(PROJECT_BLOCK)) {
    const id = blockId(block);
    if (!id) throw new Error(`projet sans id dans ${category}`);
    blocks.set(id, block);
  }
  if (blocks.size !== ids.length || ids.some((id) => !blocks.has(id))) {
    throw new Error(`Liste de projets ${category} incomplète : recharge la page.`);
  }
  let i = 0;
  return text.slice(0, start) + body.replace(PROJECT_BLOCK, () => blocks.get(ids[i++])) + text.slice(end);
}

function saveOrder(body) {
  const { projects } = readData();
  let text = fs.readFileSync(DATA_FILE, "utf8");
  const done = [];
  for (const category of CATEGORIES) {
    const ids = body.order && body.order[category];
    if (!Array.isArray(ids)) throw new Error("Ordre invalide.");
    const current = (projects[category] || []).map((p) => p.id);
    if (ids.join() === current.join()) continue;
    text = reorderCategory(text, category, ids);
    done.push(category);
  }
  if (!done.length) return;
  writeData(text);
  const check = readData().projects;
  if (CATEGORIES.some((c) => check[c].map((p) => p.id).join() !== body.order[c].join())) {
    throw new Error("L'ordre enregistré ne correspond pas : vérifie projects-data.js.");
  }
  bumpDataVersion(timestamp());
  console.log(`✓ Ordre des carrousels : ${done.join(", ")}`);
}

/* ---------- publication (git) ---------- */
function git(args) {
  return new Promise((resolve, reject) => {
    execFile(
      "git",
      ["-c", "core.quotepath=false", ...args],
      { cwd: ROOT, env: { ...process.env, GIT_TERMINAL_PROMPT: "0" }, maxBuffer: 20 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (!err) return resolve(stdout);
        const failure = new Error(`git ${args[0]} a échoué`);
        failure.detail = (stderr || stdout || err.message).trim();
        reject(failure);
      }
    );
  });
}

// Fichiers modifiés (porcelain, -z : noms avec espaces ou accents intacts)
// et commits pas encore envoyés.
async function gitStatus() {
  const entries = (await git(["status", "--porcelain=v1", "-b", "-z", "--untracked-files=all"])).split("\0");
  const head = /^## (.+?)(?:\.\.\.(\S+))?(?: \[(.*)\])?$/.exec(entries.shift()) || [];
  const changes = [];
  for (let i = 0; i < entries.length; i++) {
    if (!entries[i]) continue;
    const code = entries[i].slice(0, 2);
    changes.push({ code, path: entries[i].slice(3) });
    if (/[RC]/.test(code)) i++; // l'ancien nom suit, on le saute
  }
  return {
    branch: head[1] || "?",
    upstream: head[2] || null,
    ahead: Number(/ahead (\d+)/.exec(head[3] || "")?.[1] || 0),
    changes,
  };
}

function pushError(err) {
  const detail = err.detail || "";
  let message = "L'envoi sur GitHub a échoué.";
  if (/rejected|fetch first|non-fast-forward/i.test(detail)) {
    message = "GitHub a des changements que ton ordinateur n'a pas : récupère-les d'abord (git pull dans VS Code), puis republie.";
  } else if (/Authentication failed|could not read Username|403|denied/i.test(detail)) {
    message = "GitHub refuse la connexion : fais un push une fois depuis VS Code pour te reconnecter, puis republie.";
  } else if (/Could not resolve host|unable to access/i.test(detail)) {
    message = "Impossible de joindre GitHub : vérifie ta connexion internet.";
  }
  const failure = new Error(message);
  failure.detail = detail;
  return failure;
}

// corps : { message, paths } ; paths = fichiers affichés dans l'outil, pour
// ne rien publier d'autre que ce qui a été montré.
let publishing = false;
async function publish(body) {
  if (publishing) throw new Error("Publication déjà en cours.");
  publishing = true;
  try {
    const status = await gitStatus();
    if (status.branch === "HEAD (no branch)") throw new Error("Aucune branche active : publie depuis VS Code.");
    const shown = [...(body.paths || [])].sort().join("\n");
    if (shown !== status.changes.map((c) => c.path).sort().join("\n")) {
      throw new Error("Les fichiers ont changé entre-temps : rouvre la fenêtre Publier pour vérifier.");
    }
    if (status.changes.length) {
      const message = String(body.message || "").trim();
      if (!message) throw new Error("Écris un message pour décrire les changements.");
      await git(["add", "-A"]);
      await git(["commit", "-m", message]);
      console.log(`✓ Commit : ${message}`);
    } else if (!status.ahead && status.upstream) {
      throw new Error("Rien à publier.");
    }
    try {
      await git(status.upstream ? ["push"] : ["push", "-u", "origin", status.branch]);
    } catch (err) {
      throw pushError(err);
    }
    console.log("✓ Envoyé sur GitHub");
  } finally {
    publishing = false;
  }
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
      if (size > 400 * 1024 * 1024) reject(new Error("Envoi trop lourd : ajoute les photos en plusieurs fois."));
      else chunks.push(c);
    });
    req.on("end", () => resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")));
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (urlPath === "/") urlPath = "/_outils/projets.html";
  const file = path.resolve(ROOT, "." + urlPath);
  if (!file.startsWith(ROOT + path.sep)) return send(res, 403, "Interdit", "text/plain");
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, "Introuvable", "text/plain; charset=utf-8");
    send(res, 200, buf, TYPES[path.extname(file).toLowerCase()] || "application/octet-stream");
  });
}

// L'outil écrit des fichiers et publie sur GitHub : seule sa propre page
// (http://localhost:PORT) peut l'appeler, pas un autre site ouvert dans le
// navigateur.
const LOCAL_HOSTS = [`localhost:${PORT}`, `127.0.0.1:${PORT}`];
function isLocal(req) {
  if (!LOCAL_HOSTS.includes(req.headers.host)) return false;
  const origin = req.headers.origin;
  return req.method === "GET" || !origin || LOCAL_HOSTS.some((h) => origin === `http://${h}`);
}

const server = http.createServer(async (req, res) => {
  try {
    if (!isLocal(req)) return send(res, 403, "Interdit", "text/plain; charset=utf-8");
    const { pathname, searchParams } = new URL(req.url, "http://localhost");
    const route = `${req.method} ${pathname}`;
    if (route === "GET /api/data") return send(res, 200, readData());
    if (route === "GET /api/git") return send(res, 200, await gitStatus());
    if (route === "GET /api/youtube-cover") return send(res, 200, await youtubeCover(searchParams.get("id")), "image/jpeg");
    if (route === "POST /api/project") return send(res, 200, { ok: true, ...saveProject(await readBody(req)) });
    if (route === "POST /api/orbit") { saveOrbit(await readBody(req)); return send(res, 200, { ok: true }); }
    if (route === "POST /api/order") { saveOrder(await readBody(req)); return send(res, 200, { ok: true }); }
    if (route === "POST /api/publish") { await publish(await readBody(req)); return send(res, 200, { ok: true }); }
    if (req.method === "GET") return serveStatic(req, res);
    send(res, 405, "Méthode non gérée", "text/plain; charset=utf-8");
  } catch (err) {
    console.error("✗", err.message + (err.detail ? `\n${err.detail}` : ""));
    send(res, 400, { error: err.message, detail: err.detail });
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") console.log(`L'outil tourne déjà : ouvre http://localhost:${PORT}`);
  else console.error(err);
  process.exit(1);
});

server.listen(PORT, "127.0.0.1", () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Gestion des projets : ${url}`);
  console.log("Laisse cette fenêtre ouverte pendant que tu l'utilises, ferme-la pour l'arrêter.");
  if (!process.env.NO_OPEN) {
    const opener = process.platform === "win32" ? `start "" "${url}"` : process.platform === "darwin" ? `open "${url}"` : `xdg-open "${url}"`;
    exec(opener);
  }
});
