# RAWLAND - Portfolio

Portfolio en une page pour Mathys Roland (RAWLAND) - vidéo, photo, graphisme.
Site statique en **HTML / CSS / JavaScript vanilla**, sans framework ni étape de build.

## Structure du projet

```
rawland-portfolio/
├── index.html              → structure de la page (une seule page, ancres par section)
├── css/
│   └── style.css           → tout le style + animations
├── js/
│   ├── projects-data.js    → LE fichier à modifier pour ajouter/retirer des projets
│   └── main.js             → interactions (menu, scroll, popups, parallax…)
└── assets/
    └── images/
        ├── videos/         → miniatures des vidéos
        ├── photos/         → photos
        └── graphisme/      → visuels graphiques
```

## Voir le site en local

Aucune installation n'est nécessaire. Deux options :

1. **Le plus simple** : double-clique sur `index.html`, il s'ouvre dans ton navigateur.
2. **Recommandé pendant le développement** : dans VS Code, installe l'extension
   **Live Server**, puis clic droit sur `index.html` → *Open with Live Server*.
   Ça permet de voir tes changements se recharger automatiquement.

## Ajouter un projet

Tout se passe dans `js/projects-data.js`. Chaque projet est un objet dans un des
trois tableaux (`videos`, `photos`, `graphisme`). Pour ajouter un projet :

1. Dépose ton image (ou vidéo) dans le bon sous-dossier de `assets/images/`.
2. Copie un objet existant dans `projects-data.js` et modifie ses champs
   (`title`, `description`, `cover`, `images`, `tags`, etc. - chaque champ est
   commenté en haut du fichier).
3. Sauvegarde : la carte apparaît automatiquement sur le site, avec sa popup.

Tant qu'une section n'a pas assez de projets, des cases "à venir" s'affichent
pour garder la mise en page complète (comme sur ta maquette de référence).

> Idée pour la suite : une fois que tu auras plusieurs dizaines de projets,
> ce fichier pourra facilement être remplacé par une petite interface
> d'administration (formulaire → écrit dans un fichier JSON) sans toucher
> au reste du site, puisque tout le contenu passe déjà par une seule source
> de données.

## Mettre le projet sur GitHub

Tu as déjà créé le dépôt sur GitHub. Depuis le dossier du projet, dans le
terminal de VS Code :

```bash
# 1. Initialiser git dans le dossier (si ce n'est pas déjà fait)
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Premier commit
git commit -m "Premier commit : structure du portfolio"

# 4. Renommer la branche principale en main (si besoin)
git branch -M main

# 5. Lier le dépôt local au dépôt GitHub distant
git remote add origin https://github.com/<TON-PSEUDO>/<NOM-DU-REPO>.git

# 6. Envoyer le code sur GitHub
git push -u origin main
```

Remplace `<TON-PSEUDO>/<NOM-DU-REPO>` par l'URL exacte de ton dépôt
(visible sur la page GitHub du repo, bouton vert **Code**).

Pour les prochaines fois, une fois que tout est lié, il suffira de faire :

```bash
git add .
git commit -m "Description du changement"
git push
```

## Mettre le site en ligne (GitHub Pages)

1. Sur GitHub, va dans **Settings** → **Pages** de ton dépôt.
2. Dans **Branch**, choisis `main` et le dossier `/ (root)`, puis **Save**.
3. Au bout de 1 à 2 minutes, ton site est en ligne à une adresse du type
   `https://<TON-PSEUDO>.github.io/<NOM-DU-REPO>/`.
4. Si tu as un nom de domaine personnel (ex. mathysroland.pro), tu pourras
   le brancher plus tard dans ce même écran **Settings → Pages → Custom domain**.

## Le hero et son orbite de vignettes

Les vignettes qui tournent autour de ton portrait dans le hero (effet "anneaux
de Saturne") ne sont pas des images à part : elles sont piochées automatiquement
parmi les projets de `js/projects-data.js` (jusqu'à 6, tous types confondus).
Plus tu ajoutes de vrais projets avec une image `cover`, plus l'orbite se
remplit d'elle-même - pas besoin de fichier séparé à gérer.

Un clic sur une vignette de l'orbite ouvre directement la popup du projet
correspondant. L'orbite tourne doucement toute seule, peut être tournée à la
main (clic-glisser sur le hero), et se met en pause quand on survole une
vignette pour pouvoir cliquer dessus confortablement.

## Personnalisation rapide

- **Couleurs / polices** : variables tout en haut de `css/style.css` (`:root`).
- **Textes des sections** : directement dans `index.html`.
- **Réseaux / contact** : section `#contact` dans `index.html`.
- **Photo de profil** : remplace `assets/images/portrait.jpg`.
- **Vitesse / taille de l'orbite** : dans `js/main.js`, section 4 du fichier
  (`ORBIT_COUNT`, et les constantes `rx` / `ry` / vitesse dans `ellipseForStage`
  et la fonction `tick`).
