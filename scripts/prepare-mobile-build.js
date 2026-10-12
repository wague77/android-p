// Vérifie que le vrai build web (dist/) contient l'app, sans jamais le remplacer par une page vide.
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const indexPath = path.join(dist, "index.html");
if (!fs.existsSync(indexPath)) {
  console.error("ERREUR : dist/index.html introuvable — le build web a échoué.");
  process.exit(1);
}
let html = fs.readFileSync(indexPath, "utf8");
if (html.includes("/src/main.tsx")) {
  console.error("ERREUR : dist/index.html pointe encore vers /src/main.tsx — l'app n'a pas été compilée.");
  process.exit(1);
}
// Chemins relatifs pour le WebView Capacitor.
html = html.replace(/(src|href)="\/(?!\/)/g, '$1="./');
fs.writeFileSync(indexPath, html, "utf8");
const assets = fs.existsSync(path.join(dist, "assets")) ? fs.readdirSync(path.join(dist, "assets")) : [];
if (!assets.some((f) => f.endsWith(".js"))) {
  console.error("ERREUR : aucun fichier JavaScript dans dist/assets — interface absente.");
  process.exit(1);
}
console.log(`OK : dist/ contient l'app (${assets.length} fichiers dans assets/).`);
