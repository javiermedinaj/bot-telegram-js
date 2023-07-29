import puppeteer from "puppeteer";

async function jumboScraper(productName) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1088, height: 923 });
    await page.goto("https://www.jumbo.com.ar/");
    await page.waitForSelector(".vtex-styleguide-9-x-input");
    const input = await page.$("#downshift-0-input");
    await input.type(productName);
    await page.keyboard.press("Enter");
    await new Promise(resolve => setTimeout(resolve, 6000));

    async function clickShowMoreButton() {
      const showMoreButton = await page.$(".vtex-search-result-3-x-buttonShowMore--layout button");
      if (showMoreButton) {
        await showMoreButton.click();
        await new Promise(resolve => setTimeout(resolve, 6000));
        await clickShowMoreButton();
      }
    }

    await clickShowMoreButton();

    const productsData = await page.evaluate(() => {
      const productElements = document.querySelectorAll(".vtex-product-summary-2-x-container");
      const productsData = [];

      productElements.forEach((element) => {
        const nameElement = element.querySelector(".vtex-product-summary-2-x-productBrandName");
        const priceElement = element.querySelector(".productPrice");
        const linkElement = element.querySelector("a.vtex-product-summary-2-x-clearLink");

        const name = nameElement ? nameElement.innerText.trim() : "Nombre no encontrado";
        const price = priceElement ? priceElement.innerText.trim() : "Precio no encontrado";
        const link = linkElement ? `https://www.jumbo.com.ar${linkElement.getAttribute("href")}` : "";

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

export default jumboScraper;
