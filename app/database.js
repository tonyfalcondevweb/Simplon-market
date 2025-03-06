import sqlite3 from "sqlite3";
import { open } from "sqlite";

const db = await open({
  filename: "./data/database.sqlite",
  driver: sqlite3.Database,
});

console.log("Connexion à la base de données SQLite réussie !");

// creration table
await db.exec(
    "CREATE TABLE IF NOT EXISTS produits ( nom TEXT NOT NULL UNIQUE, id_reference_produit TEXT NOT NULL UNIQUE PRIMARY KEY, prix REAL NOT NULL, stock INTEGER NOT NULL );" +
    "CREATE TABLE IF NOT EXISTS magasins ( id_magasin INTEGER PRIMARY KEY AUTOINCREMENT, ville TEXT NOT NULL UNIQUE, nombre_de_salarie INTEGER NOT NULL );" +
    "CREATE TABLE IF NOT EXISTS analyses ( id_analyse INTEGER PRIMARY KEY AUTOINCREMENT, type_analyse TEXT NOT NULL, valeur REAL NOT NULL, date_analyse DATETIME DEFAULT CURRENT_TIMESTAMP, id_magasin INTEGER, id_reference_produit TEXT, FOREIGN KEY(id_magasin) REFERENCES magasins(id_magasin), FOREIGN KEY(id_reference_produit) REFERENCES produits(id_reference_produit) );" +
    "CREATE TABLE IF NOT EXISTS ventes ( id_vente INTEGER PRIMARY KEY AUTOINCREMENT, date_vente TEXT NOT NULL, quantite INTEGER NOT NULL, id_reference_produit TEXT, id_magasin INTEGER, FOREIGN KEY(id_reference_produit) REFERENCES produits(id_reference_produit), FOREIGN KEY(id_magasin) REFERENCES magasins(id_magasin) );"
);

export default db;
