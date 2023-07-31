import farmacityScraper from "../farmacity-scraper.js";

farmacityScraper("serum")
  .then(products => console.log(products))
  .catch(error => console.error("Ocurrió un error:", error));
