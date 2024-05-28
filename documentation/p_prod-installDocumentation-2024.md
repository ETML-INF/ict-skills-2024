
**Marche à suivre pour la mise en place de l’examen ICTskills 2024**

1. Télécharger l’environnement sur GitHub : 
   [lien vers le github](https://github.com/skills17/competition-manager/tree/main)
2. Extraire le contenu du dossier et monter le premier conteneur
   ![Image n°1](./Images%20-%20doc/Aspose.Words.cea7cc4b-4532-46e8-8c72-d3b26bd16fb9.001.png)
   ![Image n°2](./Images%20-%20doc/Aspose.Words.cea7cc4b-4532-46e8-8c72-d3b26bd16fb9.002.png)
3. Se rendre sur le dashboard de la compétition et télécharger le dossier Regional Championship 2024 [Dashboard](http://localhost:9999)
   Déchiffrer le contenu : **WebDev2024!Champ**

4. Accéder aux fichiers de la compétition via le répertoire suivant : **competitions/workspace/regio-2024**
5. Et monter les conteneurs restants
   ![Image n°3](./Images%20-%20doc/Aspose.Words.cea7cc4b-4532-46e8-8c72-d3b26bd16fb9.003.png)
   ![Image n°4](./Images%20-%20doc/Aspose.Words.cea7cc4b-4532-46e8-8c72-d3b26bd16fb9.004.png)
6. Une fois les 4 derniers conteneurs montés, installer la version LTS de node.js [Installer de Node](https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi) et lancer l’application principale avec la commande **node setup.js** dans le répertorie **competitions/workspace/regio-2024**.

   1. Choisir la version PHP y/n.
   2. Un message d’erreur devrait normalement apparaître car votre version de Docker n’est pas bonne, il faudra donc mettre ce dernier à jour : [Site de Docker](https://docs.docker.com/desktop/install/windows-install/)

      ![Image n°5](./Images%20-%20doc/Aspose.Words.cea7cc4b-4532-46e8-8c72-d3b26bd16fb9.005.png)

   3. Si un autre soucis apparaît, veuillez activer le mode développeur de Windows : Paramètres > Espace développeurs
      ![Image n°6](./Images%20-%20doc/Aspose.Words.cea7cc4b-4532-46e8-8c72-d3b26bd16fb9.006.png)

      ![Image n°7](./Images%20-%20doc/Aspose.Words.cea7cc4b-4532-46e8-8c72-d3b26bd16fb9.007.png)




7. Désormais, vous devriez pouvoir être en capacité de lancer l’application via **npm start** une fois que **node setup.js** a bien été exécuté, vous aurez accès au panneau général de l’examen (identique à l’examen) avec les tests unitaires automatiques, la check-list de chaque exercice et le temps à disposition.
