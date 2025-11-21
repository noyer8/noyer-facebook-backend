import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// -----------------------------------------
// 🔐 CONFIG FACEBOOK — À CHANGER ICI
// -----------------------------------------

const APP_ID = "2451194691945458";

// ⚠️ IMPORTANT : Mets ici ton vrai APP_SECRET Facebook
// depuis https://developers.facebook.com > Paramètres > Général
const APP_SECRET = "79e0c26ce2f3dd8d1b099c239d4ef997"; 

// L’URL de ton backend Render
const REDIRECT_URI = "https://noyer-facebook-backend.onrender.com/auth/facebook/callback";

// Une fois connecté, l’utilisateur revient ici :
const FRONT_REDIRECT = "https://noyer.io/basic-connect-facebook.html?connected=true";


// -----------------------------------------
// 🚀 ROUTE DE TEST
// -----------------------------------------
app.get("/", (req, res) => {
  res.send("API Facebook Backend OK 🚀");
});


// -----------------------------------------
// 🚀 CALLBACK FACEBOOK
// -----------------------------------------
app.get("/auth/facebook/callback", async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).send("Code OAuth manquant ❌");
    }

    // 1️⃣ Échange du code contre un token
    const tokenResponse = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          client_id: APP_ID,
          client_secret: APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code: code,
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    console.log("✔ TOKEN FACEBOOK OBTENU :", accessToken);


    // 2️⃣ Tu peux sauvegarder ici en base si tu veux
    // TODO: DB

    // 3️⃣ Redirection vers ta page front
    return res.redirect(FRONT_REDIRECT);

  } catch (err) {

    // LOG DE L’ERREUR FACEBOOK — SUPER IMPORTANT
    console.log("❌ Erreur Facebook:", err.response?.data || err.message);

    return res.status(500).send("Erreur lors de la connexion Facebook");
  }
});


// -----------------------------------------
// 🚀 LANCEMENT SERVEUR
// -----------------------------------------
app.listen(3000, () => {
  console.log("🔥 Backend Noyer en écoute sur le port 3000");
});
