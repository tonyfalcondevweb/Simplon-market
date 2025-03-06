import axios from "axios";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import db from "./database.js";

// URL des CSV
const CSV_URLS = {
  produits:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSawI56WBC64foMT9pKCiY594fBZk9Lyj8_bxfgmq-8ck_jw1Z49qDeMatCWqBxehEVoM6U1zdYx73V/pub?gid=0&single=true&output=csv",
  magasins:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSawI56WBC64foMT9pKCiY594fBZk9Lyj8_bxfgmq-8ck_jw1Z49qDeMatCWqBxehEVoM6U1zdYx73V/pub?gid=714623615&single=true&output=csv",
  ventes:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSawI56WBC64foMT9pKCiY594fBZk9Lyj8_bxfgmq-8ck_jw1Z49qDeMatCWqBxehEVoM6U1zdYx73V/pub?gid=760830694&single=true&output=csv",
};

// Fonction pour télécharger et insérer les données
const importData = async () => {
  const database = await open({
    filename: "./data/database.sqlite",
    driver: sqlite3.Database,
  });

  for (const [table, url] of Object.entries(CSV_URLS)) {
    console.log(`Importation des données pour : ${table}`);

    try {
      const response = await axios.get(url);
      const lines = response.data.split("\n").slice(1); // Ignorer l’en-tête

      for (let line of lines) {
        let values = line.split(",");
        if (values.length < 2) continue; // Ignorer les lignes vides

        if (table === "produits") {
          await database.run(
            "INSERT OR IGNORE INTO produits (nom, id_reference_produit, prix, stock) VALUES (?, ?, ?, ?)",
            values
          );
        } else if (table === "magasins") {
          await database.run(
            "INSERT OR IGNORE INTO magasins (id_magasin, ville, nombre_de_salarie) VALUES (?, ?, ?)",
            values
          );
        } else if (table === "ventes") {
          await database.run(
            "INSERT OR IGNORE INTO ventes (date_vente, id_reference_produit, quantite, id_magasin) VALUES (?, ?, ?, ?)",
            values
          );
        }
      }

      console.log(`✅ Importation terminée pour : ${table}`);
    } catch (error) {
      console.error(
        `❌ Erreur lors de l’importation de ${table} :`,
        error.message
      );
    }
  }

  await database.close();
};

// exec
importData();
