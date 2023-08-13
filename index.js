import puppeteer from "puppeteer";
import fs from "fs"

const scrape = async (masterCategoryList) => {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--window-size=100,100"]
    });

    const page = await browser.newPage();

    let nextURL = masterCategoryList[0]

    await page.goto(nextURL, {
        waitUntil: "domcontentloaded",
    });

    masterCategoryList.shift()


    let flag = true
    while (flag) {
        const pageResult = await page.evaluate(() => {

            const nodeElements = document.querySelectorAll(".category-page__member-link");

            let individualsOnThisPage = []
            let categoriesOnThisPage = []

            nodeElements.forEach(node => {
                if (node.innerHTML.includes("Category")) {
                    categoriesOnThisPage.push(node.href)
                } else {
                    individualsOnThisPage.push(node.href)
                }
            })

            try {
                nextButtonURL = document.querySelector(".category-page__pagination-next").href
            } catch (err) {
                nextButtonURL = ""
            }

            return { individuals: individualsOnThisPage, categories: categoriesOnThisPage, nextPageURL: nextButtonURL };
        });

        masterCategoryList = masterCategoryList.concat(pageResult.categories)


        const content = JSON.stringify(pageResult.individuals).replaceAll("https://starwars.fandom.com/wiki/", "").replace("[", "").replace("]", "") + ","

        try {
            fs.writeFileSync("dataVault/rawOutput.csv", content, { flag: "a" });
        } catch (error) {
            console.error(error);
        }

        if (masterCategoryList.length == 0 && pageResult.nextPageURL == "") {
            flag = false
            await browser.close();
            return console.log("Done");

        } else if (pageResult.nextPageURL == "") {
            nextURL = masterCategoryList[0]
            masterCategoryList.shift()

        } else {
            nextURL = pageResult.nextPageURL
        }

        let debugMasterList = []
        masterCategoryList.forEach(entry => {
            debugMasterList.push(entry.replace("https://starwars.fandom.com/wiki/Category:", ""))
        })
        console.log(debugMasterList);
        console.log(debugMasterList.length);
        console.log(nextURL);

        await page.goto(nextURL, {
            waitUntil: "domcontentloaded",
        });
    }

    await browser.close();
};


const linkList = ["https://starwars.fandom.com/wiki/Category:clone_troopers", "https://starwars.fandom.com/wiki/Category:Females", "https://starwars.fandom.com/wiki/Category:Males", "https://starwars.fandom.com/wiki/Category:Non-binary_individuals", "https://starwars.fandom.com/wiki/Category:Genderless_individuals", "https://starwars.fandom.com/wiki/Category:Individuals_of_unspecified_gender", "https://starwars.fandom.com/wiki/Category:Individuals_of_unidentified_gender"]

// scrape(linkList)



const getPicAndName = async (URL) => {
    console.log("object");

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--window-size=100,100"]
    });

    const page = await browser.newPage();


    await page.goto(URL, {
        waitUntil: "domcontentloaded",
    });

    const pageResult = await page.evaluate(() => {
        imageURL = document.querySelector(".pi-image-thumbnail").src.replace(/(\.(png|jpe?g))[^/]*$/i, '$1');
        nameText = document.querySelector(".page-header__title").innerHTML

        return { imageURL: imageURL, name: nameText }
    })
    return pageResult
}
