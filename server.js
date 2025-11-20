import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json({ limit: "25mb" }));

// === ROUTE TEST ===
app.get("/", (req, res) => {
  res.send("✅ ImmoPoster backend multi-client (sans compte par défaut) en ligne !");
});

// === 🔐 MIDDLEWARE DE SÉCURITÉ ===
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "❌ Accès refusé : clé API invalide" });
  }
  next();
});

// === ROUTE /publish ===
app.post("/publish", async (req, res) => {
  try {
    const { message, image_url, page_id, access_token } = req.body;

    // 🧩 Vérification obligatoire
    if (!message) {
      return res.status(400).json({ error: "❌ Le champ 'message' est requis." });
    }
    if (!page_id || !access_token) {
      return res.status(400).json({
        error: "❌ Les champs 'page_id' et 'access_token' sont obligatoires pour publier.",
      });
    }

    let response;

    if (image_url) {
      console.log("🖼️ Publication avec image :", image_url);
      response = await axios.post(
        `https://graph.facebook.com/v19.0/${page_id}/photos`,
        {
          url: image_url,
          caption: message,
          access_token,
        }
      );
    } else {
      console.log("💬 Publication texte seule :", message);
      response = await axios.post(
        `https://graph.facebook.com/v19.0/${page_id}/feed`,
        {
          message,
          access_token,
        }
      );
    }

    console.log("✅ Publication réussie :", response.data);
    res.status(200).json({ success: true, facebook_response: response.data });
  } catch (error) {
    console.error("❌ Erreur :", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// === LANCEMENT DU SERVEUR ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ImmoPoster multi-client sans compte par défaut prêt sur le port ${PORT}`);
});
