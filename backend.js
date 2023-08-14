// import puppeteer from 'puppeteer'
// import express from 'express'
// import cors from "cors"
// const app = express()
// const port = 3000



// const getPicAndName = async (URL) => {
//     console.log("object");

//     // const browser = await puppeteer.launch({
//     //     headless: false,
//     //     defaultViewport: null,
//     //     args: ["--window-size=100,100"]
//     // });

//     // const page = await browser.newPage();


//     // await page.goto(URL, {
//     //     waitUntil: "domcontentloaded",
//     // });

//     // const pageResult = await page.evaluate(() => {
//     //     let imageURL = document.querySelector(".pi-image-thumbnail").src.replace(/(\.(png|jpe?g))[^/]*$/i, '$1');
//     //     let nameText = document.querySelector(".page-header__title").innerHTML

//     //     return { imageURL: imageURL, name: nameText }
//     // })
//     // await browser.close()
    
    
    
    
//     return pageResult
// }

// app.use(cors({ origin: "http://127.0.0.1:5500" }))

// app.get('/scrape', (request, response) => {

//     const recievedName = request.url.replace("/scrape?name=", "")
//     const chracterURL = "https://starwars.fandom.com/wiki/" + recievedName
//     console.log(chracterURL);

//     const result = getPicAndName(chracterURL)

//     response.send({ imgURL: result.imageURL, name: result.name })
// })

// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`)
// })


import express from 'express';
import cors from "cors"

const app = express();
const port = 3000;

app.use(cors({ origin: "http://127.0.0.1:5500" }))

app.get('/getPage/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const response = await fetchPage(title);

        if (response.status === 200) {
            const content = JSON.parse(response.data);
            const pageTitle = content.parse.title;

            const imageContent = await fetchImage(pageTitle);
            if (imageContent.status === 200) {
                const imageJSON = JSON.parse(imageContent.data);
                let imageURL = imageJSON.image.imageserving;
                imageURL = imageURL.replace(/(\.(png|jpe?g)).*/i, '$1');

                res.send({ imgURL: result.imageURL, name: result.name })
                res.status(200).json({ success: true });
            } else {
                console.log(`Something went wrong. Error code ${imageContent.status}`);
                res.status(imageContent.status).json({ success: false });
            }
        } else {
            console.log(`Something went wrong. Error code ${response.status}`);
            res.status(response.status).json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

async function fetchPage(title) {
    return new Promise((resolve, reject) => {
        const url = `https://starwars.fandom.com/api.php?page=${title}&format=json&action=parse&prop=displaytitle`;
        app.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve({
                    status: response.statusCode,
                    data: data
                });
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

async function fetchImage(title) {
    return new Promise((resolve, reject) => {
        const url = `https://starwars.fandom.com/api.php?action=imageserving&wisTitle=${title}&format=json`;
        app.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve({
                    status: response.statusCode,
                    data: data
                });
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
