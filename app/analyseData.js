import sqlite3 from "sqlite3";
import { open } from "sqlite";
import db from "./database.js";

// Exec query et affiche le resultat
const runQuery = async (query, params = []) => {
  const database = await open({
    filename: "./data/database.sqlite",
    driver: sqlite3.Database,
  });

  const result = await database.all(query, params);
  console.log(result);
  return result;
};

// Fonction pour stocker une analyse en base
const saveAnalysis = async (
  type,
  valeur,
  id_magasin = null,
  id_reference_produit = null
) => {
  const database = await open({
    filename: "./data/database.sqlite",
    driver: sqlite3.Database,
  });

  await database.run(
    "INSERT INTO analyses (type_analyse, valeur, id_magasin, id_reference_produit) VALUES (?, ?, ?, ?)",
    [type, valeur, id_magasin, id_reference_produit]
  );
  console.log("✅ Analyse enregistrée :" + type + " - Valeur: " + valeur);
};

// Chiffre d'affaires
const getTotalRevenue = async () => {
  const query =
    "SELECT SUM(ventes.quantite * produits.prix) AS chiffre_affaires_total FROM ventes JOIN produits ON ventes.id_reference_produit = produits.id_reference_produit;";
  const result = await runQuery(query);
  if (result.length > 0) {
    await saveAnalysis("CA_TOTAL", result[0].chiffre_affaires_total);
  }
};

// Ventes par produit
const getSalesByProduct = async () => {
  const query =
    "SELECT produits.id_reference_produit, produits.nom, SUM(ventes.quantite) AS total_vendu, SUM(ventes.quantite * produits.prix) AS chiffre_affaires FROM ventes JOIN produits ON ventes.id_reference_produit = produits.id_reference_produit GROUP BY produits.id_reference_produit ORDER BY chiffre_affaires DESC;";
  const results = await runQuery(query);
  for (const row of results) {
    await saveAnalysis(
      "VENTES_PAR_PRODUIT",
      row.chiffre_affaires,
      null,
      row.id_reference_produit
    );
  }
};

// Ventes par ville
const getSalesByRegion = async () => {
  const query =
    "SELECT magasins.id_magasin, magasins.ville, SUM(ventes.quantite) AS total_vendu, SUM(ventes.quantite * produits.prix) AS chiffre_affaires FROM ventes JOIN magasins ON ventes.id_magasin = magasins.id_magasin JOIN produits ON ventes.id_reference_produit = produits.id_reference_produit GROUP BY magasins.id_magasin ORDER BY chiffre_affaires DESC;";
  const results = await runQuery(query);
  for (const row of results) {
    await saveAnalysis(
      "VENTES_PAR_REGION",
      row.chiffre_affaires,
      row.id_magasin,
      null
    );
  }
};

// Log
const runAnalyses = async () => {
  console.log("📊 Analyse des ventes :");

  console.log("\n💰 Chiffre d'affaires total :");
  await getTotalRevenue();

  console.log("\n📦 Ventes par produit :");
  await getSalesByProduct();

  console.log("\n📍 Ventes par région :");
  await getSalesByRegion();
};

// Exec
runAnalyses();
