import puppeteer from "puppeteer";

async function finanzasargyScraper() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100});
  const page = await browser.newPage();
  await page.goto("https://www.finanzasargy.com/");

  await page.waitForSelector(".cardBox.false .chakra-card__body.front");

  const exchangeRateData = await page.evaluate(() => {
    const exchangeRateElements = document.querySelectorAll(".cardBox.false .chakra-card__body.front");
    const exchangeRateData = [];

    exchangeRateElements.forEach((element) => {
      const nameElement = element.querySelector(".css-1aebuuw");
      const salePriceElement = element.querySelector(".css-srw7ja");
      const purchasePriceElement = element.querySelector(".css-1kjts4d");

      const name = nameElement ? nameElement.innerText.trim() : "Nombre no encontrado";
      const salePrice = salePriceElement ? salePriceElement.innerText.trim() : "Precio de venta no encontrado";
      const purchasePrice = purchasePriceElement ? purchasePriceElement.innerText.trim() : "Precio de compra no encontrado";

      exchangeRateData.push({ name, salePrice, purchasePrice });
    });

    return exchangeRateData;
  });

  await browser.close();

  // Filtrar los datos para quedarse solo con los que tienen un nombre válido
  const filteredData = exchangeRateData.filter((exchangeRate) => exchangeRate.name !== "Nombre no encontrado");

  return filteredData;
}

export default finanzasargyScraper;
