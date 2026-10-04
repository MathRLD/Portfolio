@echo off
rem Outil local pour choisir l'image et le cadrage des miniatures du site.
rem Double-clic : le navigateur s'ouvre sur l'outil. Fermer cette fenetre l'arrete.
cd /d "%~dp0.."
node "_outils\miniatures.js"
if errorlevel 1 pause
