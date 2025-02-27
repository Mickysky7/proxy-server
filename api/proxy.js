import cheerio from "cheerio";

export default async function handler(req, res) {
  // Obtén la URL destino desde el parámetro query "url"
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Falta el parámetro 'url'" });
  }

  try {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/115.0.0.0 Safari/537.36";

    let fetchOptions = {};
    if (req.method === "GET") {
      // Opciones para GET
      fetchOptions = {
        headers: { "User-Agent": userAgent }
      };
    } else if (req.method === "POST") {
      // Opciones para POST (se asume "application/x-www-form-urlencoded")
      const bodyContent = new URLSearchParams(req.body).toString();
      fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": userAgent
        },
        body: bodyContent
      };
    } else {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const response = await fetch(targetUrl, fetchOptions);
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }
    const html = await response.text();

    // Parsear el HTML con Cheerio
    const $ = cheerio.load(html);
    const table = $("table").first();
    if (!table.length) {
      return res.json({ data: [], message: "No se encontró la tabla" });
    }

    const results = [];
    table.find("tbody tr").each((index, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 5) {
        const nombre = $(cells[0]).text().trim();
        const rut = $(cells[1]).text().trim();
        const genero = $(cells[2]).text().trim();
        const direccion = $(cells[3]).text().trim();
        const ciudad = $(cells[4]).text().trim();

        results.push({ nombre, rut, genero, direccion, ciudad });
      }
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ data: results });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
}
