# iut-project

Sur swagger une fois authentifié pour l'authorization du token mettre : 

Bearer <token> (sans "")

Pour tester les mails : 
Créer un compte Ethereal

Allez sur 

Cliquez sur "Create Ethereal Account"
Un compte de test sera créé automatiquement avec :
Une adresse email
Un mot de passe
Les informations de configuration SMTP

Configurer le fichier .env Après avoir obtenu les informations, mettez-les dans votre fichier :

![alt text](image.png)

Tester l'envoi
Créez un nouvel utilisateur via l' API (route POST /user)
Retournez sur https://ethereal.email/
Connectez-vous avec vos identifiants
Cliquez sur "Messages"
l'email de bienvenue qui a été "envoyé" à votre nouvel utilisateur



# Configuration et utilisation de RabbitMQ

## Installation de RabbitMQ

1. Installer RabbitMQ sur Ubuntu :
```bash
sudo apt-get update
sudo apt-get install rabbitmq-server

Démarrer le service RabbitMQ :
sudo service rabbitmq-server start

Activer l'interface web de gestion :
sudo rabbitmq-plugins enable rabbitmq_management


Configuration
Ajouter l'URL de connexion RabbitMQ dans votre fichier .env :
RABBITMQ_URL=amqp://localhost

Par défaut, vous pouvez accéder à l'interface de gestion avec :
URL : http://localhost:15672
Username : guest
Password : guest

Test de l'export CSV via RabbitMQ
S'assurer que RabbitMQ est bien démarré :
Connectez-vous en tant qu'admin via l'API (POST /user/login)

Faire une requête à l'endpoint d'export /movies/export/csv
Vérifier dans l'interface RabbitMQ (http://localhost:15672) :

Aller dans l'onglet "Queues and Streams"
Une queue nommée "csv_exports" devrait apparaître
Vous pouvez voir les messages publiés et consommés
Vérifier votre email Ethereal pour voir le fichier CSV reçu

![alt text](image-1.png)
