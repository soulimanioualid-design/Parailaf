import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Helper to call Gemini models with retries and fallback models when experiencing 503 high demand
async function generateJsonWithGemini(
  ai: GoogleGenAI,
  contents: string,
  systemInstruction: string
): Promise<any> {
  // Try priority models: gemini-3.8-flash -> gemini-flash-latest -> gemini-3.1-flash-lite
  const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastErr: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            responseMimeType: "application/json"
          }
        });

        const rawText = response.text || "{}";
        let cleaned = rawText.trim();
        if (cleaned.startsWith("```json")) {
          cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        return JSON.parse(cleaned);
      } catch (err: any) {
        lastErr = err;
        const errMsg = String(err?.message || "");
        const isUnavailable =
          err?.status === 503 ||
          err?.code === 503 ||
          errMsg.includes("503") ||
          errMsg.includes("high demand") ||
          errMsg.includes("UNAVAILABLE") ||
          err?.status === 429 ||
          errMsg.includes("429") ||
          errMsg.includes("RESOURCE_EXHAUSTED");

        if (isUnavailable) {
          console.warn(`[Gemini API] ${model} attempt ${attempt + 1} unavailable. Retrying with backup...`);
          await new Promise((res) => setTimeout(res, 400 * (attempt + 1)));
        } else {
          console.warn(`[Gemini API] ${model} error:`, errMsg.slice(0, 100));
          break;
        }
      }
    }
  }

  throw lastErr || new Error("All Gemini models temporarily unavailable");
}

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
      } else if (mode === "improve_specs") {
        userPrompt = `Pour le produit médical/diabète/santé "${targetTitle}", génère les spécifications techniques ("specs") appropriées et réalistes.
Retourne ce JSON :
{
  "specs": {
    "duration": "Ex: Jusqu’à 14-15 jours (ou durée adaptée)",
    "waterproof": "Ex: IP27 résistant à l'eau ou adapté",
    "bloodSample": "Ex: Sans piqûres au bout des doigts ou adapté",
    "appCompatibility": "Ex: iOS & Android (LibreLink) ou compatible smartphone",
    "alarms": "Ex: Alertes automatiques en temps réel ou optionnel",
    "calibration": "Ex: Calibré en usine (aucun étalonnage requis)"
  }
}`;
      } else if (mode === "improve_box") {
        userPrompt = `Pour le produit médical/diabète/santé "${targetTitle}", génère la liste du contenu de la boîte / du pack ("boxContents").
Retourne ce JSON :
{
  "boxContents": [
    "Élément 1 du pack complet",
    "Élément 2 avec applicateur ou accessoires",
    "Notice et guide en français",
    "Lingettes désinfectantes ou accessoires inclus"
  ]
}`;
      } else {
        userPrompt = `Génère le contenu complet d'une fiche produit e-commerce à partir de ces informations :
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
  "specs": {
    "duration": "Jusqu’à 14-15 jours",
    "waterproof": "IP27 (résistant à l'eau)",
    "bloodSample": "Sans piqûres au bout des doigts",
    "appCompatibility": "iOS et Android"
  },
  "boxContents": [
    "1 Capteur ou appareil scellé d'origine",
    "1 Applicateur stérile individuel",
    "Lingettes de désinfection",
    "Guide d’utilisation en Français"
  ],
  "suggestedPrice": 550,
  "suggestedOriginalPrice": 750,
  "badge": "Promo"
}`;
      }

      const parsed = await generateJsonWithGemini(ai, userPrompt, systemInstruction);
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error("Erreur génération IA produit (utilisation du fallback intelligent):", error?.message || error);
      const targetTitle = req.body?.currentName || req.body?.prompt || "Produit Parailaf";
      const mode = req.body?.mode;

      if (mode === "improve_title") {
        return res.json({
          success: true,
          data: { name: `${targetTitle} - Original Certifié` },
          fallback: true
        });
      }

      if (mode === "improve_short") {
        return res.json({
          success: true,
          data: { shortDescription: `${targetTitle} 100% authentique. Contrôle fiable, prise en main immédiate et livraison express au Maroc.` },
          fallback: true
        });
      }

      if (mode === "improve_full") {
        return res.json({
          success: true,
          data: {
            fullDescription: `Découvrez ${targetTitle} chez Parailaf Maroc, spécialement sélectionné pour vous offrir un contrôle médical fiable et sécurisé au quotidien.\n\nCe dispositif répond aux normes médicales les plus strictes. Pratique et discret, il assure une tranquillité d'esprit complète.\n\nCommandez facilement avec livraison express sécurisée et paiement en espèces à la livraison partout au Maroc.`
          },
          fallback: true
        });
      }

      if (mode === "improve_specs") {
        return res.json({
          success: true,
          data: {
            specs: {
              duration: "Jusqu’à 14-15 jours",
              waterproof: "IP27 (résistant douche & baignade)",
              bloodSample: "Sans piqûres au bout des doigts",
              appCompatibility: "iOS et Android"
            }
          },
          fallback: true
        });
      }

      if (mode === "improve_box") {
        return res.json({
          success: true,
          data: {
            boxContents: [
              "1 Dispositif médical scellé d’origine",
              "1 Applicateur stérile individuel",
              "Lingettes de désinfection à l'alcool",
              "Guide d'utilisation en Français"
            ]
          },
          fallback: true
        });
      }

      return res.json({
        success: true,
        data: {
          name: targetTitle,
          shortDescription: `${targetTitle} original certifié. Idéal pour un suivi quotidien confortable et précis au Maroc.`,
          fullDescription: `Système officiel et certifié pour ${targetTitle} chez Parailaf Maroc.\n\nBénéficiez d'une précision optimale et d'une prise en main intuitive. Livré neuf sous blister scellé d'origine.\n\nCommandez facilement chez Parailaf avec livraison express et paiement sécurisé à la livraison partout au Maroc.`,
          features: [
            "Matériel 100% original certifié sous emballage stérile",
            "Simple d'utilisation au quotidien",
            "Livraison express disponible dans toutes les villes du Maroc",
            "Paiement à la réception en espèces (Cash on Delivery)"
          ],
          specs: {
            duration: "Jusqu’à 14-15 jours",
            waterproof: "IP27 (résistant douche & baignade)",
            bloodSample: "Sans piqûres au bout des doigts",
            appCompatibility: "iOS et Android"
          },
          boxContents: [
            "1 Dispositif médical scellé d’origine",
            "1 Applicateur stérile individuel",
            "Lingettes désinfectantes",
            "Notice d’utilisation détaillée en Français"
          ],
          suggestedPrice: 500,
          suggestedOriginalPrice: 650,
          badge: "Recommandé"
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
