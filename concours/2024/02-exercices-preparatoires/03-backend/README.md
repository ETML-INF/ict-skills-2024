Connexion db avec Docker
Création des conteneurs :
#Conteneur mysql
Docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql

#Conteneur phpmyadmin
Docker run --name phpmyadmin -d --link mysql:db -p 8080:80 phpmyadmin

Ensuite création de db "skills" avec le langage utf8mb4_0900_ai_ci ainsi que l'importation des données (info précisé dans le fichier dump)

dans le répértoire /src-node/db.js changement des informations du host en " host: "localhost", " et du " password: "root", "
