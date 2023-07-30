import farmacityScraper from "../farmacity-scrapper.js";

farmacityScraper("serum")
  .then(products => console.log(products))
  .catch(error => console.error("Ocurrió un error:", error));
