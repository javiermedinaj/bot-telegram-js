import finanzasargyScraper from '../scrapers/finanzy-scraper.js';

finanzasargyScraper("dolar")
  .then(products => console.log(products))
  .catch(error => console.error("Ocurrió un error:", error));
