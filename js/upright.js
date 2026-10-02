/* =====================================================
   upright.js - titres en Round 8 affichés droits
   ---------------------------------------------------
   Round 8 n'est fournie qu'en style FOUR, qui est italique, et sa
   licence interdit de modifier le fichier de police. On redresse donc
   l'affichage : chaque mot est mis dans un <span class="upright">,
   auquel style.css applique un skew inverse.
   Mot par mot et pas sur le titre entier : sinon, sur un titre de
   plusieurs lignes, chaque ligne serait décalée par rapport à la
   précédente.
   Chargé avant main.js, qui l'appelle aussi sur les titres qu'il
   génère (cartes, popup).
   ===================================================== */
function straightenText(el) {
  if (!el) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    if (node.parentElement.classList.contains("upright")) return;
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (!part.trim()) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      const word = document.createElement("span");
      word.className = "upright";
      word.textContent = part;
      frag.appendChild(word);
    });
    node.replaceWith(frag);
  });
}

document
  .querySelectorAll(".hero-heading, .section-title, .logo-band-title, .exp-logo--mono, .legal-block h2")
  .forEach(straightenText);
