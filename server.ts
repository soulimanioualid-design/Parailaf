import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

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
