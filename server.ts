import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Order notification endpoint: sends email directly to admin inbox
  app.post("/api/order-notification", async (req, res) => {
    try {
      const order = req.body;
      const adminEmail = "soulimani.oualid@gmail.com";
      console.log(`[BACKEND NOTIFICATION] Order #${order?.id} received for ${order?.customer?.fullName}`);

      const itemsFormatted = Array.isArray(order?.items)
        ? order.items.map((i: any) => `${i.quantity}x ${i.product?.name || 'Article'} (${(i.product?.price || 0) * (i.quantity || 1)} DH)`).join("\n")
        : "Articles";

      const payload = {
        _subject: `🚨 [NOUVELLE COMMANDE #${order?.id}] ${order?.customer?.fullName} - ${order?.customer?.city} (${order?.total} DH)`,
        _template: "table",
        _captcha: "false",
        "Numéro Commande": `#${order?.id}`,
        "Date": order?.createdAt || new Date().toLocaleString("fr-FR"),
        "Client": order?.customer?.fullName,
        "Téléphone": order?.customer?.phone,
        "Ville": order?.customer?.city,
        "Adresse de Livraison": order?.customer?.address,
        "Total à Encaisser (DH)": `${order?.total} DH`,
        "Mode de Paiement": "Espèces à la livraison (Cash on Delivery)",
        "Articles Commandés": itemsFormatted,
        "Instructions / Notes": order?.customer?.notes || "Aucune note spécifique",
      };

      // Send to FormSubmit to deliver to user email
      try {
        const response = await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log("[FORMSUBMIT RESPONSE]", data);
      } catch (err) {
        console.error("FormSubmit dispatch error:", err);
      }

      res.json({ success: true, message: `Notification envoyée à ${adminEmail}` });
    } catch (error) {
      console.error("Server order notification error:", error);
      res.status(500).json({ error: "Erreur lors de l'envoi de la notification" });
    }
  });

  // AI Product Content Generator (Powered by Gemini)
  app.post("/api/ai-product-generate", async (req, res) => {
    try {
      const { prompt, currentName, currentShort, currentFull, mode } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const targetTitle = currentName || prompt || "Produit Parailaf";

      if (!apiKey) {
        const fallbackData = {
          name: targetTitle,
          shortDescription: `${targetTitle} original certifié, idéal pour le contrôle précis et quotidien de la santé. Livraison express partout au Maroc.`,
          fullDescription: `Découvrez ${targetTitle} chez Parailaf Maroc. Spécialement sélectionné pour garantir une efficacité maximale et une tranquillité d'esprit au quotidien.\n\nCe produit est conforme aux normes médicales les plus strictes. Facile d'utilisation, pratique et discret, il convient parfaitement pour un suivi régulier à domicile ou en déplacement.\n\nCommandez en toute confiance avec livraison express sécurisée et paiement en espèces à la livraison partout au Maroc.`,
          features: [
            "Produit 100% original et scellé d'origine",
            "Idéal pour un suivi quotidien précis et sans contrainte",
            "Conforme aux normes médicales internationales",
            "Paiement en espèces à la réception partout au Maroc"
          ],
          suggestedPrice: 500,
          suggestedOriginalPrice: 650,
          badge: "Recommandé"
        };
        return res.json({ success: true, data: fallbackData, fallback: true });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Tu es un expert en e-commerce de matériel médical, santé et parapharmacie au Maroc (Parailaf Maroc).
Tu rédiges des fiches produits en français soigné, percutant, médicalement rassurant et adapté aux clients marocains.
Mentionne le paiement en espèces à la livraison (Cash on Delivery) et la livraison rapide au Maroc quand c'est pertinent.
Réponds STRICTEMENT sous forme d'un objet JSON valide.`;

      let userPrompt = "";
      if (mode === "improve_title") {
        userPrompt = `Améliore ce titre de produit e-commerce pour le rendre plus vendeur, clair et attractif : "${targetTitle}".
Retourne ce JSON : { "name": "Nouveau titre vendeur" }`;
      } else if (mode === "improve_short") {
        userPrompt = `Rédige une description courte (accroche en 1 ou 2 phrases, max 160 caractères) pour le produit : "${targetTitle}".
Retourne ce JSON : { "shortDescription": "Texte court" }`;
      } else if (mode === "improve_full") {
        userPrompt = `Rédige une description complète et professionnelle (2 à 3 paragraphes) pour : "${targetTitle}".
Mets en valeur les bénéfices pour le patient, la simplicité d'utilisation, l'authenticité certifiée et le service Parailaf Maroc (livraison partout au Maroc, paiement à la livraison).
Retourne ce JSON : { "fullDescription": "Texte complet" }`;
      } else {
        userPrompt = `Génère le contenu complet d'une fiche produit à partir de ces informations :
Demande / Nom : "${prompt || targetTitle}"
Détails existants :
- Titre actuel : "${currentName || ''}"
- Description courte actuelle : "${currentShort || ''}"
- Description détaillée actuelle : "${currentFull || ''}"

Retourne OBLIGATOIREMENT un objet JSON respectant exactement cette structure :
{
  "name": "Nom du produit optimisé et professionnel",
  "shortDescription": "Accroche courte (1-2 phrases percutantes)",
  "fullDescription": "Description complète et détaillée (2 à 3 paragraphes vendeurs et rassurants)",
  "features": [
    "Caractéristique clé ou avantage 1",
    "Caractéristique clé ou avantage 2",
    "Caractéristique clé ou avantage 3",
    "Caractéristique clé ou avantage 4"
  ],
  "suggestedPrice": 550,
  "suggestedOriginalPrice": 750,
  "badge": "Promo"
}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error("Erreur génération IA produit:", error);
      const targetTitle = req.body?.currentName || req.body?.prompt || "Produit Parailaf";
      return res.json({
        success: true,
        data: {
          name: targetTitle,
          shortDescription: `${targetTitle} haute qualité certifiée. Idéal pour un suivi quotidien confortable et précis au Maroc.`,
          fullDescription: `Système officiel et certifié pour ${targetTitle}.\n\nBénéficiez d'une précision optimale et d'une prise en main intuitive. Livré neuf sous blister scellé d'origine.\n\nCommandez facilement chez Parailaf avec livraison express et paiement sécurisé à la livraison au Maroc.`,
          features: [
            "Matériel original certifié sous emballage stérile",
            "Simple d'utilisation au quotidien",
            "Livraison express disponible dans toutes les villes du Maroc",
            "Paiement à la réception en espèces"
          ],
          suggestedPrice: 500,
          suggestedOriginalPrice: 650,
          badge: "Promo"
        },
        fallback: true
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
