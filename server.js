import express from "express";
import fetch from "node-fetch"; // w Node 18+ można użyć wbudowanego fetch
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// <<< WSTAW SWÓJ TOKEN >>>
const API_TOKEN = "jKGxrrJGaQKRpkDmCvqOEqIBzPIPAfXq";
const API_BASE = "https://www.ncei.noaa.gov/cdo-web/api/v2";

app.use(cors()); // pozwala na wywołania z Twojego frontendu

// Serwuj pliki statyczne (HTML, CSS, JS)
app.use(express.static("."));

// Funkcja pomocnicza
async function proxyFetch(endpoint, res) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { token: API_TOKEN },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Endpointy proxy
app.get("/stations", (req, res) => {
  const query = req.url.replace("/stations", "");
  proxyFetch(`/stations${query}`, res);
});
app.get("/datasets", (req, res) => proxyFetch("/datasets", res));
app.get("/data", (req, res) => {
  const query = req.url.replace("/data", ""); // zachowujemy parametry ?datasetid=...
  proxyFetch(`/data${query}`, res);
});

app.listen(PORT, () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});
