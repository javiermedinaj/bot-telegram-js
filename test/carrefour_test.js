import carrefourScraper from "../carrefour-scraper.js";

carrefourScraper("yerba")
  .then(products => console.log(products))
  .catch(error => console.error("Ocurrió un error:", error));
