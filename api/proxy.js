export default async function handler(req, res) {
  // Obtén la URL destino desde el parámetro query "url"
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("Falta el parámetro 'url'");
  }

  try {
    if (req.method === "GET") {
      // Manejo de solicitudes GET
      const response = await fetch(targetUrl);
      const text = await response.text();
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(response.ok ? 200 : response.status).send(text);
    } else if (req.method === "POST") {
      // Manejo de solicitudes POST (se asume "application/x-www-form-urlencoded")
      const bodyContent = new URLSearchParams(req.body).toString();
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: bodyContent
      });
      const text = await response.text();
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(response.ok ? 200 : response.status).send(text);
    } else {
      return res.status(405).send("Método no permitido");
    }
  } catch (error) {
    return res.status(500).send(error.toString());
  }
}
