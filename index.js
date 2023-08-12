import puppeteer from "puppeteer";
import fs from "fs"

const scrape = async (url, links) => {

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

            let names = []
            nodeElements.forEach(node => {
                if (node.innerHTML.includes("Category")) {
                    links.push(node.href)
                } else {
                    names.push(node.href)
                }
            })

            try {
                url = document.querySelector(".category-page__pagination-next").href
            } catch (err) {
                url = ""
            }

            return { names: names, url: url, links: links };
        });

        const content = JSON.stringify(scrapedContent.names).replaceAll("https://starwars.fandom.com/wiki/", "").replace("[", "").replace("]", "") + ","

        try {
            fs.writeFileSync("dataVault/testing.csv", content, { flag: "a" });
        } catch (error) {
            console.error(error);
        }

        if (scrapedContent.url = "" && scrapedContent.links.length > 0) {
            scrapedContent.links.shift()
            console.log(scrapedContent.links[0]);
            scrapedContent.url = scrapedContent.links[0]
        } else if (scrapedContent.links.length == 0) {
            flag = false
            return console.log("Done");
        } else {
            await page.goto(scrapedContent.url, {
                waitUntil: "domcontentloaded",
            });
        }
    }
    
    await browser.close();
};

const linkList = ["https://starwars.fandom.com/wiki/Category:clone_troopers", "https://starwars.fandom.com/wiki/Category:Clone_cadets"]

scrape(linkList[0], linkList)

// const loop = () => {
//     if (linkList.length <= 0) {
//         return
//     }
//     console.log(linkList[0]);
//     scrape(linkList[0])
//         .then(() => {
//             linkList.shift()
//             loop()
//         })
// }

// loop()

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