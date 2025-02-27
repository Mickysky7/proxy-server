import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 3000;

// Para procesar datos en formato URL-encoded (útil para solicitudes POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Proxy para solicitudes GET
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    res.status(400).send("Falta el parámetro 'url'");
    return;
  }
  try {
    const response = await fetch(targetUrl);
    const text = await response.text();
    res.set("Access-Control-Allow-Origin", "*");
    res.send(text);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Proxy para solicitudes POST
app.post("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    res.status(400).send("Falta el parámetro 'url'");
    return;
  }
  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(req.body).toString()
    });
    const text = await response.text();
    res.set("Access-Control-Allow-Origin", "*");
    res.send(text);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Servidor proxy corriendo en http://localhost:${port}`);
});
