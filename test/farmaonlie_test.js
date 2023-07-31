import farmaonlineScraper from '../scrapers/farmaonline-scraper.js';

farmaonlineScraper("serum")
  .then(products => console.log(products))
  .catch(error => console.error("Ocurrió un error:", error));
