import puppeteer from "puppeteer";

async function farmacityScraper(productName) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900 });
    await page.goto("https://www.farmacity.com.ar/");

    // Escribir el nombre del producto en el campo de búsqueda
    await page.type('#ftBox8a1201ce111e42728c51807d06ecf7d4', productName);

    // Presionar la tecla "Enter" para realizar la búsqueda
    await page.keyboard.press("Enter");

    // Esperar un tiempo para asegurarnos de que se carguen los resultados de búsqueda
    await new Promise (resolve => setTimeout(resolve, 6000));

    // Hacer clic en el botón de filtrado por precio más bajo
    await page.waitForSelector('.orderBy');
    await page.click('.orderBy');

    await new Promise (resolve => setTimeout(resolve, 6000)); // Esperar un tiempo adicional para asegurarnos de que los resultados se carguen completamente

    const productsData = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".product-card-container");
      const productsData = [];

      productElements.forEach((element) => {
        const nameElement = element.querySelector(".product-card-name");
        const priceElement = element.querySelector(".best-price");
        const linkElement = element.querySelector(".product-card-head");

        const name = nameElement ? nameElement.innerText.trim() : "Nombre no encontrado";
        const price = priceElement ? priceElement.innerText.trim() : "Precio no encontrado";
        const link = linkElement ? linkElement.getAttribute("href") : "Enlace no encontrado";

        productsData.push({ name, price, link });
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

export default farmacityScraper;
