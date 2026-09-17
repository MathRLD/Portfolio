/* =====================================================
   projects-data.js
   ---------------------------------------------------
   C'est LE SEUL fichier à modifier pour ajouter,
   modifier ou retirer un projet du portfolio.

   Pour ajouter un projet : copie un des objets d'exemple
   ci-dessous dans le bon tableau (videos / photos /
   graphisme) et remplace les valeurs.

   Champs communs à tous les projets :
   - id          : identifiant unique (texte, sans espace)
   - title       : titre affiché sur la carte et la popup
   - client      : nom du client / contexte (optionnel, "" si aucun)
   - description : texte affiché dans la popup
   - cover       : chemin de l'image de couverture (carte)
   - tags        : liste de mots-clés affichés dans la popup

   Champ spécifique aux vidéos :
   - media.type  : "youtube" | "vimeo" | "file"
   - media.src   : ID YouTube/Vimeo, ou chemin vers un fichier vidéo

   Champ spécifique aux photos / graphisme :
   - images      : liste de chemins d'images pour la galerie
                   de la popup (peut contenir juste "cover")
   ===================================================== */

const projectsData = {

  /* ----------------- VIDÉOS ----------------- */
  videos: [
    {
      id: "stpauli-koln-2026-video",
      title: "FC St. Pauli — 1. FC Köln",
      client: "",
      description: "Vidéo de couverture du match de Bundesliga entre le FC St. Pauli et le 1. FC Köln (17.04.2026) — rythme, action et ambiance de stade en mouvement.",
      cover: "assets/images/videos/stpauli-cover.jpg",
      tags: ["Sport", "Football", "Bundesliga", "Montage"],
      media: { type: "youtube", src: "WOpr0kPQ1hg" }
    },
    {
      id: "sncf-intercites",
      title: "Vigilance Partagée",
      client: "SNCF Intercités",
      description: "Film de sensibilisation à la sécurité pour SNCF Intercités, pensé pour rythmer un message institutionnel avec une réalisation cinématographique.",
      cover: "assets/images/videos/sncf-intercites-cover.jpg",
      tags: ["Réalisation", "Montage", "Institutionnel"],
      media: { type: "youtube", src: "" } // ex: "dQw4w9WgXcQ"
    }
    // Ajoute d'autres vidéos ici en copiant le bloc ci-dessus.
  ],

  /* ----------------- PHOTOS ----------------- */
  photos: [
    {
      id: "football-1",
      title: "Match professionnel",
      client: "",
      description: "Couverture photo d'un match de football professionnel — action, intensité et ambiance de stade.",
      cover: "assets/images/photos/football-1.jpg",
      tags: ["Sport", "Football", "Reportage"],
      images: ["assets/images/photos/football-1.jpg"]
    },
    {
      id: "stpauli-koln-2026",
      title: "FC St. Pauli — 1. FC Köln",
      client: "",
      description: "Reportage photo du match de Bundesliga entre le FC St. Pauli et le 1. FC Köln (17.04.2026) — intensité du jeu, ambiance de tribune et instantanés capturés au fil du match.",
      cover: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-53.jpg",
      tags: ["Sport", "Football", "Bundesliga", "Reportage"],
      images: [
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-53.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-6.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-10.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-13.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-24.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-29.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-32.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-41.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-44.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-47.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-57.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-59.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-78.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-85.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-112.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-113.jpg",
        "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-125.jpg"
      ]
    }
    // Ajoute d'autres photos ici. 10 emplacements sont prévus
    // dans la grille par défaut ; les cases vides afficheront
    // "Photo à venir" tant qu'elles ne sont pas remplies.
  ],

  /* ----------------- GRAPHISME ----------------- */
  graphisme: [
    {
      id: "challenge-ecoles",
      title: "Challenge des écoles",
      client: "Projet académique",
      description: "Affiche et déclinaisons graphiques réalisées pour le Challenge des écoles — travail de composition et de charte graphique sportive.",
      cover: "assets/images/graphisme/challenge-ecoles.jpg",
      tags: ["Affiche", "Identité visuelle"],
      images: ["assets/images/graphisme/challenge-ecoles.jpg"]
    }
    // Ajoute d'autres projets graphiques ici.
  ]
};
