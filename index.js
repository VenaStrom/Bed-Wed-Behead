import puppeteer from "puppeteer";
import fs from "fs"


const getNames = async (url) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--window-size=100,100"]
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });

    const listOfLinks = await page.evaluate(() => {

        const nodeElements = document.querySelectorAll(".category-page__member-link");

        let links = []
        nodeElements.forEach(node => {
            links.push(node.href)
        })

        return links;
    });

    // console.log(listOfLinks);
    // let alternatives = []
    // let randomChar = listOfLinks[Math.floor(Math.random() * listOfLinks.length)]
    // let i = 0
    // while (randomChar.includes() == false && i < 3) {
    //     randomChar = listOfLinks[Math.floor(Math.random() * listOfLinks.length)]
    //     i++
    //     alternatives.push(randomChar)
    // }

    const content = JSON.stringify(listOfLinks).replaceAll("https://starwars.fandom.com/wiki/", "").replace("[", "").replace("]", "") + ","

    try {
        fs.writeFileSync("links.csv", content, { flag: "a" });
        // file written successfully
    } catch (err) {
        console.error(err);
    }

    await browser.close();
};


// getNames("https://starwars.fandom.com/wiki/Category:Females")
// getNames("https://starwars.fandom.com/wiki/Category:Unidentified_females")
// getNames("https://starwars.fandom.com/wiki/Category:Droids_with_feminine_programming")
getNames("https://starwars.fandom.com/wiki/Category:Males")
// getNames("https://starwars.fandom.com/wiki/Category:Unidentified_males")
// getNames("https://starwars.fandom.com/wiki/Category:Droids_with_masculine_programming")
// getNames("https://starwars.fandom.com/wiki/Category:Non-binary_individuals")
// getNames("https://starwars.fandom.com/wiki/Category:Trans_individuals")
// getNames("https://starwars.fandom.com/wiki/Category:Genderless_individuals")
// getNames("https://starwars.fandom.com/wiki/Category:Droids_with_no_gender_programming")
// getNames("https://starwars.fandom.com/wiki/Category:Individuals_of_unspecified_gender")
// getNames("https://starwars.fandom.com/wiki/Category:Droids_with_unspecified_gender_programming")
// getNames("https://starwars.fandom.com/wiki/Category:Individuals_of_unidentified_gender")
