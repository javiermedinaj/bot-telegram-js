import jumboScraper from "../jumbo-scraper.js";

jumboScraper("Producto a testear")
  .then(products => console.log(products))
  .catch(error => console.error("Ocurrió un error:", error));
