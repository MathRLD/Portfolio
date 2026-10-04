@echo off
rem Outil local de gestion des projets : miniatures, ordre des carrousels,
rem anneau du hero et publication sur GitHub.
rem Double-clic : le navigateur s'ouvre sur l'outil. Fermer cette fenetre l'arrete.
cd /d "%~dp0.."
node "_outils\projets.js"
if errorlevel 1 pause
