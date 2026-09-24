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
      title: "FC St. Pauli - 1. FC Köln",
      client: "",
      description: "Vidéo de couverture du match de Bundesliga entre le FC St. Pauli et le 1. FC Köln (17.04.2026) - rythme, action et ambiance de stade en mouvement.",
      cover: "assets/images/videos/stpauli-cover.jpg",
      tags: ["Sport", "Football", "Bundesliga", "Montage"],
      media: { type: "youtube", src: "WOpr0kPQ1hg" }
    },
    {
      id: "sncf-valeurs-eigs",
      title: "SNCF Intercités - Valeurs EIGS",
      client: "SNCF Intercités",
      description: "Film institutionnel réalisé pour SNCF Intercités autour des valeurs portées par l'EIGS - mise en scène du quotidien des équipes à bord et en gare.",
      cover: "assets/images/videos/valeurs-eigs-cover.jpg",
      tags: ["Réalisation", "Montage", "Institutionnel", "SNCF"],
      media: { type: "youtube", src: "pB53WOa4bag" }
    },
    {
      id: "nsmtt-short-film",
      title: "NSMTT",
      client: "",
      description: "Court-métrage tourné autour du tennis de table - échanges, tension de match et complicité entre joueurs captés au plus près de l'action.",
      cover: "assets/images/videos/nsmtt-cover.jpg",
      tags: ["Court-métrage", "Sport", "Réalisation"],
      media: { type: "youtube", src: "fbg9Hu20Xts" }
    },
    {
      id: "viviane-short-film",
      title: "Là où attend Viviane",
      client: "SNCF Intercités",
      description: "Court-métrage pour SNCF Intercités - une traversée de gare et de quai qui suit l'attente et les rencontres du quotidien des voyageurs.",
      cover: "assets/images/videos/viviane-cover.jpg",
      tags: ["Court-métrage", "Réalisation", "SNCF"],
      media: { type: "youtube", src: "470WgFqnpT4" }
    }
    // Ajoute d'autres vidéos ici en copiant le bloc ci-dessus.
  ],

  /* ----------------- PHOTOS ----------------- */
  photos: [
    {
      id: "stpauli-koln-2026",
      title: "FC St. Pauli - 1. FC Köln",
      client: "",
      description: "Reportage photo du match de Bundesliga entre le FC St. Pauli et le 1. FC Köln (17.04.2026) - intensité du jeu, ambiance de tribune et instantanés capturés au fil du match.",
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
    },
    {
      id: "sncf-intercites-lifestyle",
      title: "SNCF Intercités - Shooting lifestyle",
      client: "SNCF Intercités",
      description: "Shooting photo lifestyle à bord d'un train Intercités - lumière naturelle, ambiance de voyage et mise en scène du quotidien des voyageurs.",
      cover: "assets/images/photos/Shootingsncf1/web/Shooting photo TDN.jpg",
      tags: ["Lifestyle", "Institutionnel", "SNCF"],
      images: [
        "assets/images/photos/Shootingsncf1/web/Shooting photo TDN.jpg",
        "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-3.jpg",
        "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-9.jpg",
        "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-11.jpg",
        "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-16.jpg",
        "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-18.jpg",
        "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-26.jpg",
        "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-34.jpg"
      ]
    },
    {
      id: "sncf-intercites-gare",
      title: "SNCF Intercités - Gares & trains de nuit",
      client: "SNCF Intercités",
      description: "Reportage photo en gare et à bord des trains Intercités - jeux de lumière nocturnes et mouvement des rames sur les quais.",
      cover: "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-35.jpg",
      tags: ["Reportage", "Institutionnel", "SNCF"],
      images: [
        "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-35.jpg",
        "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-21.jpg",
        "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-32.jpg",
        "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-34.jpg",
        "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-37.jpg",
        "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-40.jpg",
        "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-41.jpg"
      ]
    },
    {
      id: "bobital-2026",
      title: "Bobital 2026",
      client: "",
      description: "Reportage photo d'un événement en plein air à Bobital (2026) - scène, lumière de fin de journée et ambiance de foule captées sur le vif.",
      cover: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026.jpg",
      tags: ["Événementiel", "Concert", "Reportage"],
      images: [
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-3.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-5.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-6.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-8.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-9.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-12.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-13.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-14.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-18.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-19.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-25.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-26.jpg",
        "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-28.jpg"
      ]
    },
    {
      id: "jeune-lion-release-party",
      title: "Jeune Lion - Release Party",
      client: "",
      description: "Couverture photo de la release party de Jeune Lion (12.02.2026) - scène, lumières et ambiance de soirée.",
      cover: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-17.jpg",
      tags: ["Événementiel", "Musique", "Reportage"],
      images: [
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-17.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-2.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-4.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-5.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-8.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-10.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-11.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-12.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-13.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-15.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-22.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-23.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-25.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-27.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-29.jpg",
        "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-30.jpg"
      ]
    },
    {
      id: "redstar-eag",
      title: "Red Star FC - EA Guingamp",
      client: "",
      description: "Reportage photo du match de Ligue 2 entre le Red Star FC et l'En Avant Guingamp (24.04) - intensité du jeu et liesse collective en fin de rencontre.",
      cover: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-99.jpg",
      tags: ["Sport", "Football", "Ligue 2", "Reportage"],
      images: [
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-99.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-13.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-14.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-18.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-19.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-24.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-25.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-27.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-32.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-59.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-81.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-83.jpg",
        "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-88.jpg",
        "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-2.jpg",
        "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-14.jpg",
        "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-17.jpg",
        "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-35.jpg",
        "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-39.jpg",
        "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-41.jpg",
        "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-42.jpg",
        "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-49.jpg"
      ]
    },
    {
      id: "redstar-grenoble",
      title: "Red Star FC - Grenoble Foot 38",
      client: "",
      description: "Reportage photo du match entre le Red Star FC et Grenoble Foot 38 - but, fumigènes et ferveur des tribunes.",
      cover: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_BUT-3.jpg",
      tags: ["Sport", "Football", "Reportage"],
      images: [
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_BUT-3.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_12-6.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_5_-3.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_BUT-6.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_FIN-7.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_FIN-8.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF-6.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF-9.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF-17.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF-22.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF-24.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_fumee-3.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_fumee-5.jpg",
        "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_fumee-7.jpg"
      ]
    },
    {
      id: "redstar-laval",
      title: "Red Star FC - Stade Lavallois",
      client: "",
      description: "Reportage photo du match entre le Red Star FC et le Stade Lavallois - action sur le terrain et ambiance survoltée des supporters.",
      cover: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand46.jpg",
      tags: ["Sport", "Football", "Reportage"],
      images: [
        "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand46.jpg",
        "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand11.jpg",
        "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand13.jpg",
        "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand32.jpg",
        "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand35.jpg",
        "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand48.jpg",
        "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand55.jpg",
        "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand64.jpg",
        "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand91.jpg",
        "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand96.jpg"
      ]
    }
    // Ajoute d'autres photos ici. 10 emplacements sont prévus
    // dans la grille par défaut ; les cases vides afficheront
    // "Photo à venir" tant qu'elles ne sont pas remplies.
  ],

  /* ----------------- GRAPHISME ----------------- */
  graphisme: [
    {
      id: "france-euro-affiches",
      title: "France Euro - Affiches",
      client: "",
      description: "Création d'affiches et de mockups de présentation autour du thème France / Euro.",
      cover: "assets/images/graphisme/FranceEuro/Francemockup2.jpg",
      tags: ["Affiche", "Mockup", "Graphisme"],
      images: [
        "assets/images/graphisme/FranceEuro/France_affiche1.jpg",
        "assets/images/graphisme/FranceEuro/France_affiche2.jpg",
        "assets/images/graphisme/FranceEuro/Francemockup1.jpg",
        "assets/images/graphisme/FranceEuro/Francemockup2.jpg"
      ]
    },
    {
      id: "linkyjob-goodies",
      title: "LinkyJob - Goodies",
      client: "",
      description: "Déclinaison de l'identité visuelle sur des supports goodies : stylo, tote bag, lanyard.",
      cover: "assets/images/graphisme/LinkyJob/Minimal Perspective Logo Mockup.jpg",
      tags: ["Identité visuelle", "Goodies", "Mockup"],
      images: [
        "assets/images/graphisme/LinkyJob/Mockup.jpg",
        "assets/images/graphisme/LinkyJob/Free_Pen_Mockup_5.jpg",
        "assets/images/graphisme/LinkyJob/Free_Tote_Bag_Mockup_on_the_Floor.jpg",
        "assets/images/graphisme/LinkyJob/Lanyard Mockup.jpg",
        "assets/images/graphisme/LinkyJob/Minimal Perspective Logo Mockup.jpg"
      ]
    },
    {
      id: "rebrand-as-roma",
      title: "Rebrand - AS Roma",
      client: "",
      description: "Projet de refonte du logo et de l'identité visuelle du club de football AS Roma.",
      cover: "assets/images/graphisme/Rebrand_As_Roma/MockupAsroma.jpg",
      tags: ["Identité visuelle", "Logo", "Rebrand"],
      images: [
        "assets/images/graphisme/Rebrand_As_Roma/MockupAsroma.jpg",
        "assets/images/graphisme/Rebrand_As_Roma/Logo_asroma.png"
      ]
    },
    {
      id: "sncf-affiche-securite",
      title: "SNCF Intercités - Affiche sécurité",
      client: "SNCF Intercités",
      description: "Affiche de sensibilisation à la sécurité pour SNCF Intercités.",
      cover: "assets/images/graphisme/SNCF/Affiche_Secu_Mathys_VF_mockup.jpg",
      tags: ["Affiche", "Institutionnel", "SNCF"],
      images: [
        "assets/images/graphisme/SNCF/Affiche_Secu_Mathys_VF.jpg",
        "assets/images/graphisme/SNCF/Affiche_Secu_Mathys_VF_mockup.jpg"
      ]
    },
    {
      id: "te-ora-naho",
      title: "Te Ora Naho - Identité visuelle",
      client: "",
      description: "Création de logo et déclinaisons visuelles pour Te Ora Naho.",
      cover: "assets/images/graphisme/TeOraNaho/6.jpg",
      tags: ["Logo", "Identité visuelle"],
      images: [
        "assets/images/graphisme/TeOraNaho/logo.jpg",
        "assets/images/graphisme/TeOraNaho/1.jpg",
        "assets/images/graphisme/TeOraNaho/2.jpg",
        "assets/images/graphisme/TeOraNaho/3.jpg",
        "assets/images/graphisme/TeOraNaho/5.jpg",
        "assets/images/graphisme/TeOraNaho/6.jpg"
      ]
    },
    {
      id: "workshop-ping-affiches",
      title: "Workshop Ping - Affiches",
      client: "Cercle Paul Bert",
      description: "Affiches de communication pour des événements de tennis de table (match régional, journée portes ouvertes).",
      cover: "assets/images/graphisme/Workshop_Ping/mockupping.jpg",
      tags: ["Affiche", "Sport", "Tennis de table"],
      images: [
        "assets/images/graphisme/Workshop_Ping/MatchRégional3_V1.jpg",
        "assets/images/graphisme/Workshop_Ping/Portes_Ouvertes_30_05.jpg",
        "assets/images/graphisme/Workshop_Ping/mockupping.jpg"
      ]
    }
    // Ajoute d'autres projets graphiques ici en copiant le gabarit d'un
    // objet "photos" ou "videos" ci-dessus (mêmes champs communs + `images`).
  ]
};
