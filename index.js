import puppeteer from "puppeteer";
import fs from "fs"
import { count } from "console";


const scrape = async (urlParam) => {
    let url = urlParam

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--window-size=100,100"]
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });

    let flag = true
    while (flag) {
        const scrapedContent = await page.evaluate(() => {

            const nodeElements = document.querySelectorAll(".category-page__member-link");

            let links = []
            nodeElements.forEach(node => {
                links.push(node.href)
            })

            try {
                url = document.querySelector(".category-page__pagination-next").href
            } catch (err) {
                url = ""
            }

            return { links, url };
        });


        // let alternatives = []
        // let randomChar = listOfLinks[Math.floor(Math.random() * listOfLinks.length)]
        // let i = 0
        // while (randomChar.includes() == false && i < 3) {
        //     randomChar = listOfLinks[Math.floor(Math.random() * listOfLinks.length)]
        //     i++
        //     alternatives.push(randomChar)
        // }

        const content = JSON.stringify(scrapedContent.links).replaceAll("https://starwars.fandom.com/wiki/", "").replace("[", "").replace("]", "") + ","

        try {
            fs.writeFileSync("links.csv", content, { flag: "a" });
            // file written successfully
        } catch (err) {
            console.error(err);
        }

        if (url = "") {
            flag = false
            break
        }

        await page.goto(scrapedContent.url, {
            waitUntil: "domcontentloaded",
        });
    }

    await browser.close();
};


// scrape("https://starwars.fandom.com/wiki/Category:Males")
// scrape("https://starwars.fandom.com/wiki/Category:Females")
// scrape("https://starwars.fandom.com/wiki/Category:Unidentified_females")
// scrape("https://starwars.fandom.com/wiki/Category:Droids_with_feminine_programming")
// scrape("https://starwars.fandom.com/wiki/Category:Unidentified_males")
// scrape("https://starwars.fandom.com/wiki/Category:Droids_with_masculine_programming")
// scrape("https://starwars.fandom.com/wiki/Category:Non-binary_individuals")
// scrape("https://starwars.fandom.com/wiki/Category:Trans_individuals")
// scrape("https://starwars.fandom.com/wiki/Category:Genderless_individuals")
// scrape("https://starwars.fandom.com/wiki/Category:Droids_with_no_gender_programming")
// scrape("https://starwars.fandom.com/wiki/Category:Individuals_of_unspecified_gender")
// scrape("https://starwars.fandom.com/wiki/Category:Droids_with_unspecified_gender_programming")
// scrape("https://starwars.fandom.com/wiki/Category:Individuals_of_unidentified_gender")