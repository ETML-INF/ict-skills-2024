# Procédure de mise en place de l'examen ICTskills 2024

1. **Téléchargement de l'environnement sur GitHub :**
   - [Téléchargez l'environnement](https://github.com/skills17/competition-manager/tree/main) depuis GitHub.

2. **Extraction du contenu du dossier et montage du premier conteneur :**
   - Après le téléchargement, extrayez le contenu du dossier et montez le premier conteneur en utilisant la commande `docker compose up` dans ce dossier-ci.

3. **Accès au dashboard de la compétition :**
   - Rendez-vous sur le [dashboard de la compétition](http://localhost:9999/) et téléchargez le dossier du Championnat Régional 2024.
   - Déchiffrez le contenu avec le mot de passe : `WebDev2024!Champ`.

4. **Accès aux fichiers de la compétition :**
   - Accédez aux fichiers de la compétition via le répertoire suivant : `competitions/workspace/regio-2024`.

5. **Installation de la version LTS de node.js et lancement de l'application principale :**
   - Une fois les 4 derniers conteneurs montés, [installez la version LTS de node.js](https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi).
   - Lancez l'application principale avec la commande `node setup.js` dans le répertoire `competitions/workspace/regio-2024`.
     - Choisissez votre mode de travail (PHP/Node) en répondant par `y` ou `n`.
     - Si une erreur survient en raison de la version de Docker, [mettez Docker à jour](https://docs.docker.com/desktop/install/windows-install/).
     - Si d'autres problèmes surviennent, activez le mode développeur de Windows via : `Paramètres > Espace développeurs`.

6. **Lancement de l'application :**
   - Vous devriez désormais être en mesure de lancer l'application via `npm start` une fois que `node setup.js` a été exécuté.
   - Vous aurez accès au panneau général de l'examen, identique à l'examen, comprenant les tests unitaires automatiques, la check-list de chaque exercice et le temps à disposition.
