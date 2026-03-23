import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/b3/quotes", async (req, res) => {
    try {
      // Tentativa de buscar dados reais da B3 ou de um agregador estável
      // Usaremos a brapi.dev como fonte real e estável para dados da B3
      const response = await fetch("https://brapi.dev/api/quote/list?limit=50");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching B3 data:", error);
      res.status(500).json({ error: "Failed to fetch B3 data" });
    }
  });

  app.get("/api/b3/indices", async (req, res) => {
    try {
      const response = await fetch("https://brapi.dev/api/quote/list?type=index");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch indices" });
    }
  });

  app.get("/api/b3/fiis", async (req, res) => {
    try {
      // Brapi supports FIIs via the same quote list with a filter
      const response = await fetch("https://brapi.dev/api/quote/list?type=fund");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FIIs" });
    }
  });

  app.get("/api/b3/chart/:range", async (req, res) => {
    const { range } = req.params;
    let brapiRange = "1d";
    let brapiInterval = "15m";

    switch (range) {
      case "1W":
        brapiRange = "5d";
        brapiInterval = "1h";
        break;
      case "1M":
        brapiRange = "1mo";
        brapiInterval = "1d";
        break;
      case "1Y":
        brapiRange = "1y";
        brapiInterval = "1wk";
        break;
      default:
        brapiRange = "1d";
        brapiInterval = "15m";
    }

    try {
      const response = await fetch(`https://brapi.dev/api/quote/^BVSP?range=${brapiRange}&interval=${brapiInterval}`);
      const data = await response.json();
      
      if (data.results && data.results[0] && data.results[0].historicalDataPrice) {
        const formattedData = data.results[0].historicalDataPrice.map((item: any) => ({
          time: range === "1D" || range === "1W" 
            ? new Date(item.date * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : new Date(item.date * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          price: item.close
        }));
        res.json(formattedData);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
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
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
