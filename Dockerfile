# Utiliser l'image officielle de Node.js
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json depuis le dossier app
COPY app/package.json app/package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Lancer les scripts hello, import et analyse dans cet ordre
CMD ["sh", "-c", "npm run hello && npm run import && npm run analyse"]
