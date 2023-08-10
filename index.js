import puppeteer from "puppeteer";

const getNames = async (url) => {
    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will in full width and height)
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    // Open a new page
    const page = await browser.newPage();

    // On this new page:
    // - open the "url" website
    // - wait until the dom content is loaded (HTML is ready)
    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });

    // Get page data
    const name = await page.evaluate(() => {

        const name = document.querySelector(".quote");

        const text = name.querySelector(".text").innerText;
        const author = name.querySelector(".author").innerText;

        return { name, image };
    });

    // Display the quotes
    console.log(name);

    // Close the browser
    await browser.close();
};

// Start the scraping
getNames("https://starwars.fandom.com/wiki/Category:Droids_with_no_gender_programming");
