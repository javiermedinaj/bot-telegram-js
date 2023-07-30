import puppeteer from "puppeteer";

async function carrefourScraper(productName) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900 });
    await page.goto("https://www.carrefour.com.ar/");
    await page.waitForSelector('.vtex-styleguide-9-x-input');

    const input = await page.$('.vtex-styleguide-9-x-input');
    await input.type(productName);
    await page.keyboard.press("Enter");
    await new Promise(resolve => setTimeout(resolve, 6000));

    await page.waitForSelector('.valtech-carrefourar-search-result-0-x-orderByButton');
    await page.click('.valtech-carrefourar-search-result-0-x-orderByButton');
    await page.waitForSelector('.valtech-carrefourar-search-result-0-x-orderByOptionsContainer');
    await page.click('.valtech-carrefourar-search-result-0-x-orderbypriceasc');
    await new Promise(resolve => setTimeout(resolve, 6000));

    const productsData = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".vtex-product-summary-2-x-container");
      const productsData = [];

      productElements.forEach((element) => {
        const nameElement = element.querySelector(".vtex-product-summary-2-x-brandName");
        const priceIntegerElement = element.querySelector('.valtech-carrefourar-product-price-0-x-currencyInteger');
        const priceDecimalElement = element.querySelector('.valtech-carrefourar-product-price-0-x-currencyDecimal');
        const linkElement = element.querySelector('a.vtex-product-summary-2-x-clearLink');

        const name = nameElement ? nameElement.innerText.trim() : "Nombre no encontrado";
        const priceInteger = priceIntegerElement ? priceIntegerElement.innerText.trim() : "Precio no encontrado";
        const priceDecimal = priceDecimalElement ? priceDecimalElement.innerText.trim() : "00";
        const price = `$${priceInteger.replace(',', '')}.${priceDecimal.replace(',', '')}`;

        const link = linkElement ? `https://www.carrefour.com.ar${linkElement.getAttribute("href")}` : `Si el link no funciona puedes probar lo siguiente: https://www.carrefour.com.ar${productName} y filtrar por mas barato`;

        if (price !== "$0") {
          productsData.push({ name, price, link });
        }
      });

      return productsData;
    });

    await browser.close();

    productsData.sort((a, b) => parseFloat(a.price.replace("$", "").replace(".", "").replace(",", ".")) -
      parseFloat(b.price.replace("$", "").replace(".", "").replace(",", ".")));

    const top10Products = productsData.slice(0, Math.min(productsData.length, 10));

    return top10Products;
  } catch (error) {
    console.error("Error occurred:", error);
    await browser.close();
    throw error;
  }
}

export default carrefourScraper;
