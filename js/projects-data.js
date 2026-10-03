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
   - cover       : chemin de l'image de couverture (popup)
   - thumb       : version allégée de cover pour les cartes des
                   carrousels et l'anneau du hero (optionnel :
                   si absent, cover est utilisée à la place).
                   WebP ~1000px de large, dans assets/images/thumbs/
   - tags        : liste de mots-clés affichés dans la popup

   Champ spécifique aux vidéos :
   - media.type  : "youtube" | "vimeo" | "file"
   - media.src   : ID YouTube/Vimeo, ou chemin vers un fichier vidéo
   - media.vertical : true pour une vidéo verticale 9:16 (Shorts,
                   Reels…) : la popup s'affiche alors en portrait.
                   Dans ce cas, cover doit aussi être verticale.

   Champ spécifique aux photos / graphisme :
   - images      : liste des images de la galerie de la popup,
                   chacune { src: "chemin", alt: "description de l'image" }.
                   Un simple chemin reste accepté (l'alt sera alors
                   le titre du projet), mais un alt propre à chaque
                   image est préférable.

   Pour les projets graphisme, le premier tag indique le cadre :
   "Projet client", "Projet personnel" ou "Projet étudiant".
   ===================================================== */

const projectsData = {

  /* ----------------- VIDÉOS ----------------- */
  videos: [
    {
      id: "stpauli-koln-2026-video",
      title: "FC St. Pauli - 1. FC Köln",
      client: "Film court sur une journée de Bundesliga",
      description: "Vidéo du match de Bundesliga entre le FC St. Pauli et le 1. FC Köln (17.04.2026), sur le terrain et dans les tribunes.",
      cover: "assets/images/videos/stpauli-cover.jpg",
      thumb: "assets/images/thumbs/stpauli-koln-2026-video.webp",
      tags: ["Sport", "Football", "Bundesliga", "Montage"],
      media: { type: "youtube", src: "WOpr0kPQ1hg" }
    },
    {
      id: "sncf-valeurs-eigs",
      title: "SNCF Intercités - Valeurs EIGS",
      client: "SNCF Intercités",
      description: "Film institutionnel pour SNCF Intercités sur les valeurs de l'EIGS, tourné avec les équipes à bord et en gare.",
      cover: "assets/images/videos/valeurs-eigs-cover.jpg",
      thumb: "assets/images/thumbs/sncf-valeurs-eigs.webp",
      tags: ["Réalisation", "Montage", "Institutionnel", "SNCF"],
      media: { type: "youtube", src: "pB53WOa4bag" }
    },
    {
      id: "nsmtt-short-film",
      title: "NSMTT",
      client: "Projet client · Tennis de table",
      description: "Court-métrage pour le club de Neuilly-sur-Marne Tennis de Table, filmé au plus près des joueurs pendant les matchs.",
      cover: "assets/images/videos/nsmtt-cover.jpg",
      thumb: "assets/images/thumbs/nsmtt-short-film.webp",
      tags: ["Court-métrage", "Sport", "Réalisation"],
      media: { type: "youtube", src: "fbg9Hu20Xts" }
    },
    {
      id: "viviane-short-film",
      title: "Là où attend Viviane",
      client: "SNCF Intercités",
      description: "Court-métrage pour SNCF Intercités. On suit des voyageurs qui attendent leur train, et les rencontres qu'ils font en gare et sur le quai.",
      cover: "assets/images/videos/viviane-cover.jpg",
      thumb: "assets/images/thumbs/viviane-short-film.webp",
      tags: ["Court-métrage", "Réalisation", "SNCF"],
      media: { type: "youtube", src: "470WgFqnpT4" }
    },
    {
      id: "further-joe-juice-vlog",
      title: "Vlog Shooting",
      client: "Further Athletics x Joe & The Juice",
      description: "Vlog vertical tourné caméra à l'épaule pendant un shooting Further Athletics x Joe & The Juice à Paris. Les coulisses de la journée.",
      cover: "assets/images/videos/further-joe-juice-cover.jpg",
      thumb: "assets/images/thumbs/further-joe-juice-vlog.webp",
      tags: ["Vlog", "Short", "Coulisses", "Montage"],
      media: { type: "youtube", src: "_vUNS86Ek4M", vertical: true }
    }
    // Ajoute d'autres vidéos ici en copiant le bloc ci-dessus.
  ],

  /* ----------------- PHOTOS ----------------- */
  photos: [
    {
      id: "stpauli-koln-2026",
      title: "FC St. Pauli - 1. FC Köln",
      client: "Bundesliga",
      description: "Reportage photo du match de Bundesliga entre le FC St. Pauli et le 1. FC Köln (17.04.2026), sur le terrain et dans les tribunes.",
      cover: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-53.jpg",
      thumb: "assets/images/thumbs/stpauli-koln-2026.webp",
      tags: ["Sport", "Football", "Bundesliga", "Reportage"],
      images: [
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-53.jpg", alt: "Duel au milieu de terrain entre un joueur du FC St. Pauli et trois joueurs du 1. FC Köln, devant une tribune pleine" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-6.jpg", alt: "Drapeau blanc du FC St. Pauli agité au premier plan, joueurs flous derrière" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-10.jpg", alt: "Les deux équipes entrent sur la pelouse au milieu des confettis" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-13.jpg", alt: "Joueurs du FC St. Pauli sur une pelouse noyée dans la fumée rose des fumigènes" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-24.jpg", alt: "Phase de jeu entre joueurs du FC St. Pauli et du 1. FC Köln devant la tribune" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-29.jpg", alt: "Joueur du 1. FC Köln frappant le ballon le long de la ligne de touche, sous les projecteurs" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-32.jpg", alt: "Capitaine du FC St. Pauli, brassard arc-en-ciel au bras, donnant des consignes" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-41.jpg", alt: "Joueur du FC St. Pauli tenant le ballon avant une remise en jeu" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-44.jpg", alt: "Joueur du FC St. Pauli numéro 27, de dos face à la tribune" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-47.jpg", alt: "Confettis qui tombent sous le toit du stade, à contre-jour des projecteurs" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-57.jpg", alt: "Supporter juché sur le grillage devant une tribune rougie par les fumigènes" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-59.jpg", alt: "Supporter au mégaphone en contre-jour, dans la lumière rouge des fumigènes" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-78.jpg", alt: "Projecteurs du stade allumés au-dessus de la tribune, sous un ciel violet" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-85.jpg", alt: "Supporter de dos, bière à la main, sous un grand drapeau rouge et noir" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-112.jpg", alt: "Tribune de supporters embrasée par les fumigènes et les drapeaux" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-113.jpg", alt: "Duel pour le ballon de nuit, sous les projecteurs" },
        { src: "assets/images/photos/stpauli/web/StPauli-Cologne_17_04-125.jpg", alt: "Drapeaux agités dans la lumière des fumigènes, en flou de mouvement" }
      ]
    },
    {
      id: "sncf-intercites-lifestyle",
      title: "SNCF Intercités - Shooting lifestyle",
      client: "SNCF Intercités",
      description: "Shooting lifestyle à bord d'un train Intercités, en lumière naturelle, pour montrer le voyage côté passagers.",
      cover: "assets/images/photos/Shootingsncf1/web/Shooting photo TDN.jpg",
      thumb: "assets/images/thumbs/sncf-intercites-lifestyle.webp",
      tags: ["Lifestyle", "Institutionnel", "SNCF"],
      images: [
        { src: "assets/images/photos/Shootingsncf1/web/Shooting photo TDN.jpg", alt: "Voyageuse regardant par la fenêtre d'un compartiment Intercités, en lumière naturelle" },
        { src: "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-3.jpg", alt: "Deux voyageuses face à face près de la fenêtre, la campagne défile derrière" },
        { src: "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-9.jpg", alt: "Contrôleur SNCF échangeant avec une voyageuse à l'entrée d'un compartiment" },
        { src: "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-11.jpg", alt: "Voyageuse souriante avec sa valise dans le couloir du train, à côté d'un contrôleur" },
        { src: "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-16.jpg", alt: "Voyageuse souriante sur sa couchette, téléphone en main" },
        { src: "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-18.jpg", alt: "Deux amies sous la couette d'une couchette, regardant un téléphone" },
        { src: "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-26.jpg", alt: "Voyageuse blottie contre un oreiller, regardant par la fenêtre du train" },
        { src: "assets/images/photos/Shootingsncf1/web/Shooting photo TDN-34.jpg", alt: "Deux amies en bataille d'oreillers dans un compartiment couchettes" }
      ]
    },
    {
      id: "sncf-intercites-gare",
      title: "SNCF Intercités - Gares & trains de nuit",
      client: "SNCF Intercités",
      description: "Reportage de nuit en gare et à bord des trains Intercités. Les lumières des quais et les rames en mouvement.",
      cover: "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-35.jpg",
      thumb: "assets/images/thumbs/sncf-intercites-gare.webp",
      tags: ["Reportage", "Institutionnel", "SNCF"],
      images: [
        { src: "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-35.jpg", alt: "Locomotive Intercités entrant en gare de nuit, phares allumés, le long des quais éclairés" },
        { src: "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-21.jpg", alt: "Couloir vide d'une voiture Intercités, en perspective" },
        { src: "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-32.jpg", alt: "Voiture Intercités à quai, porte ouverte, sous la verrière de la gare" },
        { src: "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-34.jpg", alt: "Locomotive en gare de nuit, avec une traînée lumineuse rouge en pose longue" },
        { src: "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-37.jpg", alt: "Rame Intercités éclairée à quai, verrière de la gare en arrière-plan" },
        { src: "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-40.jpg", alt: "Train filé le long du quai en pose longue" },
        { src: "assets/images/photos/Shootingsncf2/web/Photos_Shooting_05_05-41.jpg", alt: "Rame qui défile en pose longue sur un quai désert" }
      ]
    },
    {
      id: "bobital-2026",
      title: "Bobital 2026",
      client: "",
      description: "Reportage photo au festival Bobital L'Armor à Sons, édition 2026. Les concerts, le public, et une belle lumière en fin de journée.",
      cover: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026.jpg",
      thumb: "assets/images/thumbs/bobital-2026.webp",
      tags: ["Événementiel", "Concert", "Reportage"],
      images: [
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026.jpg", alt: "Silhouette d'un rappeur sur scène en contre-jour, au coucher du soleil" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-3.jpg", alt: "Rappeur en casquette rouge au micro sur la scène du festival" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-5.jpg", alt: "Rappeur en casquette rouge chantant tête levée, arbres en arrière-plan" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-6.jpg", alt: "Deux rappeurs au bord de la scène face au public, en contre-plongée" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-8.jpg", alt: "Deux artistes sur scène devant la foule du festival, en plein jour" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-9.jpg", alt: "Structure d'éclairage de la scène en contre-jour" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-12.jpg", alt: "Rappeur aux lunettes vertes, doigt levé, micro en main" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-13.jpg", alt: "Rappeur aux lunettes vertes en mouvement sur scène, dans la lumière des projecteurs" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-14.jpg", alt: "Rappeur aux lunettes vertes au micro, projecteur en arrière-plan" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-18.jpg", alt: "Chanteuse au micro en gros plan, devant la structure de la scène" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-19.jpg", alt: "Chanteuse en mouvement sur scène, ciel nuageux en arrière-plan" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-25.jpg", alt: "Rappeur sur scène dans une lumière orange et la fumée" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-26.jpg", alt: "Artiste bras levé dans une lumière bleue, bouteille d'eau à la main" },
        { src: "assets/images/photos/bobital/web/@_rawland_MathysRoland_BOBITAL2026-28.jpg", alt: "Rappeur au micro en contre-plongée, dans des faisceaux bleus et jaunes" }
      ]
    },
    {
      id: "jeune-lion-release-party",
      title: "Jeune Lion - Release Party",
      client: "",
      description: "Photos de la release party de Jeune Lion, le 12 février 2026.",
      cover: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-17.jpg",
      thumb: "assets/images/thumbs/jeune-lion-release-party.webp",
      tags: ["Événementiel", "Musique", "Reportage"],
      images: [
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-17.jpg", alt: "Pendentif tête de lion doré sur un t-shirt blanc, en gros plan" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-2.jpg", alt: "Photo en flou de mouvement dans les lumières rouges de la soirée" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-4.jpg", alt: "Jeune Lion au micro dans un décor de miroirs" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-5.jpg", alt: "Jeune Lion souriant, micro en main, pendentif lion autour du cou" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-8.jpg", alt: "Jeune Lion en flou de mouvement dans une lumière violette" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-10.jpg", alt: "Jeune Lion au micro, baigné de lumière rose" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-11.jpg", alt: "Jeune Lion de profil, son reflet visible dans le plafond miroir" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-12.jpg", alt: "Flou de mouvement dans une lumière orange et rouge" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-13.jpg", alt: "Jeune Lion qui rappe, main tendue vers l'objectif" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-15.jpg", alt: "Silhouette dans la pénombre, éclairée par des néons rouges" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-22.jpg", alt: "Jeune Lion au micro, vu en plongée entre miroirs et enceintes" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-23.jpg", alt: "Jeune Lion au micro, son reflet au-dessus de lui" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-25.jpg", alt: "Gros plan de Jeune Lion au micro, dans des lumières rouges et bleues" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-27.jpg", alt: "Jeune Lion au micro en noir et blanc, entouré d'enceintes" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-29.jpg", alt: "Jeune Lion chantant tête levée sous un miroir qui le reflète" },
        { src: "assets/images/photos/jeunelion/web/Releaseparty_Jeune-Lion_12_02_26_@Rawland-30.jpg", alt: "Jeune Lion vu de haut, entre enceintes et néons rouges" }
      ]
    },
    {
      id: "redstar-eag",
      title: "Red Star FC - EA Guingamp",
      client: "Ligue 2",
      description: "Reportage photo du match de Ligue 2 entre le Red Star FC et l'En Avant Guingamp (24.04), jusqu'à la fête en fin de match.",
      cover: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-99.jpg",
      thumb: "assets/images/thumbs/redstar-eag.webp",
      tags: ["Sport", "Football", "Ligue 2", "Reportage"],
      images: [
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-99.jpg", alt: "Joueurs du Red Star FC qui fêtent la fin du match face au public, poings levés" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-13.jpg", alt: "Deux joueurs du Red Star en chasuble jaune à l'échauffement, à contre-jour" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-14.jpg", alt: "Joueur du Red Star en chasuble jaune, de dos, pendant l'échauffement" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-18.jpg", alt: "Silhouette d'un joueur du Red Star à contre-jour sur un ciel violet" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-19.jpg", alt: "Joueur du Red Star en chasuble, immeubles du quartier en arrière-plan" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-24.jpg", alt: "Jambes et crampons d'un joueur sur la pelouse, en gros plan" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-25.jpg", alt: "Ballon au pied d'un joueur du Red Star, au ras de la pelouse" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-27.jpg", alt: "Deux joueurs du Red Star de dos, dans le soleil couchant" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-32.jpg", alt: "Tribune des supporters du Red Star, drapeaux verts et blancs levés" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-59.jpg", alt: "Joueurs du Red Star réunis et souriants sur la pelouse" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-81.jpg", alt: "Crampons rouges d'un joueur au ras de l'herbe" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-83.jpg", alt: "Supporters du Red Star en tribune sous de grands drapeaux verts" },
        { src: "assets/images/photos/redstareag/web/RedStarFC_EAG_@Rawland_24_04-88.jpg", alt: "Duel épaule contre épaule entre un joueur du Red Star et un joueur de Guingamp" },
        { src: "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-2.jpg", alt: "Tribune du stade sous les projecteurs, en fin de journée" },
        { src: "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-14.jpg", alt: "Joueur du Red Star floqué Kamila 7, bras levé vers les supporters" },
        { src: "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-17.jpg", alt: "Dos du maillot vert du Red Star floqué Mounia 98, en gros plan" },
        { src: "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-35.jpg", alt: "Joueur du Red Star qui glisse à genoux sur la pelouse pour célébrer" },
        { src: "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-39.jpg", alt: "Remplaçant du Red Star en chasuble jaune, de dos, face à un projecteur" },
        { src: "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-41.jpg", alt: "Projecteur et toit de la tribune de nuit, remplaçant flou au premier plan" },
        { src: "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-42.jpg", alt: "Projecteur du stade de nuit, joueur flou au premier plan" },
        { src: "assets/images/photos/redstareag/web/RedStar_EAG_@Rawland_24_04-49.jpg", alt: "Action de jeu de nuit sous les projecteurs, immeubles en arrière-plan" }
      ]
    },
    {
      id: "redstar-grenoble",
      title: "Red Star FC - Grenoble Foot 38",
      client: "Ligue 2",
      description: "Reportage photo du match entre le Red Star FC et Grenoble Foot 38. Un but, des fumigènes et des tribunes bien chaudes.",
      cover: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_BUT-3.jpg",
      thumb: "assets/images/thumbs/redstar-grenoble.webp",
      tags: ["Sport", "Football", "Ligue 2", "Reportage"],
      images: [
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_BUT-3.jpg", alt: "Joueurs du Red Star en maillot blanc qui se félicitent sur la pelouse du Stade des Alpes" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_12-6.jpg", alt: "Joueur du Red Star floqué Sylla 22 face à un joueur de Grenoble" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_5_-3.jpg", alt: "Joueur du Red Star qui tire un corner devant une tribune de Grenoble" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_BUT-6.jpg", alt: "Accolade entre joueurs du Red Star après un but" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_FIN-7.jpg", alt: "Brassard de capitaine du Red Star, en gros plan" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_FIN-8.jpg", alt: "Joueur du Red Star, mains jointes, regardant vers la tribune" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF.jpg", alt: "Joueur de Grenoble qui boit au bord du terrain" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF-6.jpg", alt: "Remplaçant du Red Star de dos, devant la fumée des fumigènes" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF-9.jpg", alt: "Bâche des supporters du Red Star dans la fumée du parcage visiteurs" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF-17.jpg", alt: "Maillot blanc du Red Star en gros plan, étoile rouge sur la poitrine" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF-22.jpg", alt: "Joueurs du Red Star qui saluent leurs supporters en fin de match" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_VF-24.jpg", alt: "Photo de groupe des joueurs du Red Star devant leurs supporters" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_fumee-3.jpg", alt: "Joueur du Red Star ballon en main, dans la brume des fumigènes" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_fumee-5.jpg", alt: "Joueur du Red Star numéro 25 qui s'apprête à tirer un corner" },
        { src: "assets/images/photos/redstargrenoble/web/RED_STAR__GRENOBLE_fumee-7.jpg", alt: "Remplaçant du Red Star numéro 93, de dos, qui regarde le match" }
      ]
    },
    {
      id: "redstar-laval",
      title: "Red Star FC - Stade Lavallois",
      client: "Ligue 2",
      description: "Reportage photo du match entre le Red Star FC et le Stade Lavallois, sur le terrain et côté supporters.",
      cover: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand46.jpg",
      thumb: "assets/images/thumbs/redstar-laval.webp",
      tags: ["Sport", "Football", "Ligue 2", "Reportage"],
      images: [
        { src: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand46.jpg", alt: "Joueur du Red Star floqué Durand 7 qui applaudit les supporters en tribune" },
        { src: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand11.jpg", alt: "Joueur du Red Star qui passe devant le parcage des supporters, drapeaux levés" },
        { src: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand13.jpg", alt: "Portrait d'un joueur du Red Star sur fond de ciel clair" },
        { src: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand32.jpg", alt: "Joueur du Red Star en chasuble jaune à l'échauffement" },
        { src: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand35.jpg", alt: "Joueur du Red Star souriant, qui fête avec les supporters devant la tribune" },
        { src: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand48.jpg", alt: "Joueurs du Red Star de dos, face à la tribune visiteurs" },
        { src: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand55.jpg", alt: "Joueurs du Red Star qui dansent bras levés devant leurs supporters" },
        { src: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand64.jpg", alt: "Joueur du Red Star qui prend un selfie devant les supporters" },
        { src: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand91.jpg", alt: "Joueur du Red Star à la sortie du tunnel" },
        { src: "assets/images/photos/redstarlaval/web/Laval-RedStar_RawLand96.jpg", alt: "Joueur du Red Star floqué K. Cabral 91, de dos" }
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
      description: "Projet personnel autour de l'équipe de France à l'Euro 2024 : une affiche « En route vers la finale » en deux versions, mise en situation en mockups.",
      cover: "assets/images/graphisme/FranceEuro/Francemockup2.jpg",
      thumb: "assets/images/thumbs/france-euro-affiches.webp",
      tags: ["Projet personnel", "Affiche", "Football", "Mockup"],
      images: [
        { src: "assets/images/graphisme/FranceEuro/France_affiche1.jpg", alt: "Affiche « En route vers la finale » : les joueurs de l'équipe de France réunis en cercle sur fond bleu, avec des étoiles dorées, version avec cadre" },
        { src: "assets/images/graphisme/FranceEuro/France_affiche2.jpg", alt: "Affiche « En route vers la finale », version pleine page" },
        { src: "assets/images/graphisme/FranceEuro/Francemockup1.jpg", alt: "Les deux versions de l'affiche posées sur une surface en béton" },
        { src: "assets/images/graphisme/FranceEuro/Francemockup2.jpg", alt: "Affiche « En route vers la finale » encadrée, posée au sol contre un mur" }
      ]
    },
    {
      id: "linkyjob-goodies",
      title: "LinkyJob - Identité visuelle",
      client: "",
      description: "Projet étudiant de fin de M2 : l'identité visuelle de LinkyJob, une startup qui met en relation des étudiants étrangers et des particuliers pour des missions. J'ai créé le logo, la charte graphique et ses déclinaisons, jusqu'aux goodies.",
      cover: "assets/images/graphisme/LinkyJob/Minimal Perspective Logo Mockup.jpg",
      thumb: "assets/images/thumbs/linkyjob-goodies.webp",
      tags: ["Projet étudiant", "Identité visuelle", "Logo", "Charte graphique"],
      images: [
        { src: "assets/images/graphisme/LinkyJob/Mockup.jpg", alt: "Logo LinkyJob brodé sur une veste matelassée noire" },
        { src: "assets/images/graphisme/LinkyJob/Free_Pen_Mockup_5.jpg", alt: "Quatre stylos aux couleurs de LinkyJob" },
        { src: "assets/images/graphisme/LinkyJob/Free_Tote_Bag_Mockup_on_the_Floor.jpg", alt: "Tote bag blanc avec le logo LinkyJob" },
        { src: "assets/images/graphisme/LinkyJob/Lanyard Mockup.jpg", alt: "Badge intervenant LinkyJob porté autour du cou" },
        { src: "assets/images/graphisme/LinkyJob/Minimal Perspective Logo Mockup.jpg", alt: "Logo LinkyJob orange et turquoise sur fond gris clair" }
      ]
    },
    {
      id: "rebrand-as-roma",
      title: "Rebrand - AS Roma",
      client: "",
      description: "Projet personnel pour m'exercer à la création de logo. Je suis reparti des codes classiques de l'AS Roma, la louve, le rouge et le jaune, pour les revisiter dans un style plus graphique.",
      cover: "assets/images/graphisme/Rebrand_As_Roma/MockupAsroma.jpg",
      thumb: "assets/images/thumbs/rebrand-as-roma.webp",
      tags: ["Projet personnel", "Logo", "Rebrand"],
      images: [
        { src: "assets/images/graphisme/Rebrand_As_Roma/MockupAsroma.jpg", alt: "Logo revisité de l'AS Roma, une tête de louve rouge et jaune, imprimé sur un maillot blanc" },
        { src: "assets/images/graphisme/Rebrand_As_Roma/Logo_asroma.png", alt: "Logo revisité de l'AS Roma : tête de louve, bandeau « Giallorossi », 1927 et AS.ROMA" }
      ]
    },
    {
      id: "sncf-affiche-securite",
      title: "SNCF Intercités - Affiche sécurité",
      client: "SNCF Intercités",
      description: "Affiche pour la communication interne d'Intercités, qui sensibilise les agents aux risques du métier sur les voies. Le visuel parodie Stranger Things : ciel rouge, éclairs et titre « Soyons exemplaires » dans la typo de la série.",
      cover: "assets/images/graphisme/SNCF/Affiche_Secu_Mathys_VF_mockup.jpg",
      thumb: "assets/images/thumbs/sncf-affiche-securite.webp",
      tags: ["Projet client", "Affiche", "Communication interne", "SNCF"],
      images: [
        { src: "assets/images/graphisme/SNCF/Affiche_Secu_Mathys_VF.jpg", alt: "Affiche « Sur les rails, la fiction s'éteint » : trois agents en tenue orange sur les voies sous un ciel rouge, titre « Soyons exemplaires » façon Stranger Things" },
        { src: "assets/images/graphisme/SNCF/Affiche_Secu_Mathys_VF_mockup.jpg", alt: "L'affiche sécurité en situation dans un abribus, de nuit sous la pluie" }
      ]
    },
    {
      id: "te-ora-naho",
      title: "Te Ora Naho - Identité visuelle",
      client: "",
      description: "Projet étudiant de M1 : une proposition d'identité visuelle pour Te Ora Naho, une association de protection de l'environnement en Polynésie française. Logo, papeterie, textile et page d'accueil du site.",
      cover: "assets/images/graphisme/TeOraNaho/6.jpg",
      thumb: "assets/images/thumbs/te-ora-naho.webp",
      tags: ["Projet étudiant", "Logo", "Identité visuelle"],
      images: [
        { src: "assets/images/graphisme/TeOraNaho/logo.jpg", alt: "Logo Te Ora Naho : formes arrondies bleu turquoise au-dessus du nom de l'association" },
        { src: "assets/images/graphisme/TeOraNaho/1.jpg", alt: "Cartes de visite Te Ora Naho à motifs floraux" },
        { src: "assets/images/graphisme/TeOraNaho/2.jpg", alt: "Tampon encreur avec le logo Te Ora Naho" },
        { src: "assets/images/graphisme/TeOraNaho/3.jpg", alt: "T-shirt bleu canard avec le logo Te Ora Naho en blanc" },
        { src: "assets/images/graphisme/TeOraNaho/5.jpg", alt: "Page d'accueil du site Te Ora Naho sur un écran : « Préservons ensemble la biodiversité polynésienne »" },
        { src: "assets/images/graphisme/TeOraNaho/6.jpg", alt: "Logo Te Ora Naho embossé sur papier turquoise" }
      ]
    },
    {
      id: "workshop-ping-affiches",
      title: "Workshop Ping - Affiches",
      client: "",
      description: "Projet étudiant de M2, en collaboration avec le Neuilly-sur-Marne Tennis de Table. J'ai créé des affiches pour aider le club à mieux communiquer : annonce de match, journée portes ouvertes et déclinaisons pour Instagram.",
      cover: "assets/images/graphisme/Workshop_Ping/mockupping.jpg",
      thumb: "assets/images/thumbs/workshop-ping-affiches.webp",
      tags: ["Projet étudiant", "Affiche", "Tennis de table"],
      images: [
        { src: "assets/images/graphisme/Workshop_Ping/MatchRégional3_V1.jpg", alt: "Affiche du dernier match de la saison en Régionale 3 du Neuilly-sur-Marne Tennis de Table, samedi 6 juin 2026" },
        { src: "assets/images/graphisme/Workshop_Ping/Portes_Ouvertes_30_05.jpg", alt: "Affiche des portes ouvertes du Neuilly-sur-Marne Tennis de Table, samedi 30 mai 2026" },
        { src: "assets/images/graphisme/Workshop_Ping/mockupping.jpg", alt: "Les deux affiches déclinées en publications Instagram" }
      ]
    }
    // Ajoute d'autres projets graphiques ici en copiant le gabarit d'un
    // objet "photos" ou "videos" ci-dessus (mêmes champs communs + `images`).
  ]
};
