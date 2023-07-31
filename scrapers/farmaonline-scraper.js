import puppeteer from "puppeteer";

async function scrollPageToEnd(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const maxScrolls = 50; 

      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || maxScrolls <= 0) {
          clearInterval(timer);
          resolve();
        }
        maxScrolls--;
      }, 100); 
    });
  });
}

async function farmaonlineScraper(productName) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900 });
    await page.goto("https://www.farmaonline.com");
    await page.waitForSelector('#downshift-0-input');
    await page.type('#downshift-0-input', productName);
    await page.keyboard.press("Enter");
    await new Promise(resolve => setTimeout(resolve, 6000));

    
    await scrollPageToEnd(page);

    const productsData = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".vtex-product-summary-2-x-container");

      const productsData = [];

      productElements.forEach((element) => {
        const brandElement = element.querySelector(".vtex-product-summary-2-x-productBrandName");
        const nameElement = element.querySelector(".vtex-product-summary-2-x-brandName");
        const priceElement = element.querySelector(".vtex-product-price-1-x-sellingPriceValue");
        const linkElement = element.querySelector("a");
        
        const brand = brandElement ? brandElement.innerText.trim() : "Marca no encontrada";
        const name = nameElement ? nameElement.innerText.trim() : "Nombre no encontrado";
        const price = priceElement ? priceElement.innerText.trim() : "Precio no encontrado";
        const link = linkElement ? `https://www.farmaonline.com${linkElement.getAttribute("href")}` : "";

        if (price !== "$0") {
          productsData.push({ brand, name, price, link });
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

export default farmaonlineScraper;
