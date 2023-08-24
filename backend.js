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


// import express from 'express';
// import cors from "cors"

// const app = express();
// const port = 3000;

// app.use(cors({ origin: "http://127.0.0.1:5500" }))

// app.get('/api/getPage/:title', async (req, res) => {
//     const titleURL = req.params.title;
//     console.log(titleURL);
//     try {
//         const response = await fetchPage(titleURL);

//         if (response.status === 200) {
//             const content = JSON.parse(response.data);
//             const pageTitle = content.parse.title;
//             console.log(pageTitle);

//             const imageContent = await fetchImage(pageTitle);
//             if (imageContent.status === 200) {
//                 const imageJSON = JSON.parse(imageContent.data);
//                 let imageURL = imageJSON.image.imageserving;
//                 imageURL = imageURL.replace(/(\.(png|jpe?g)).*/i, '$1');

//                 res.send({ imageURL: imageURL, name: pageTitle })
//                 res.status(200).json({ success: true });
//             } else {
//                 console.log(`Something went wrong. Error code ${imageContent.status}`);
//                 res.status(imageContent.status).json({ success: false });
//             }
//         } else {
//             console.log(`Something went wrong. Error code ${response.status}`);
//             res.status(response.status).json({ success: false });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false });
//     }
// });



// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });


import express, { response } from "express";
import cors from "cors"
import axios from "axios"
const app = express();
const port = 3000;

app.use(cors({ origin: "http://127.0.0.1:5500" }))

app.get('/api/getPage/:uriName', async (req, res) => {
    const uriName = req.params.uriName
    const url = {
        name: `https://starwars.fandom.com/api.php?page=${uriName}&format=json&action=parse&prop=displaytitle`,
        imageURL: `https://starwars.fandom.com/api.php?action=imageserving&wisTitle=${uriName}&format=json`
    }

    let name = ""
    let imageURL = ""

    console.log(uriName);

    try {
        const response = await axios.get(url.name)
        name = response.data.parse.title
    } catch (error) {
        console.error("Name", error);
    }

    try {
        const response = await axios.get(url.imageURL)
        imageURL = response.data.image.imageserving
        imageURL = imageURL.replace(/(\.(png|jpe?g)).*/i, '$1');
    } catch (error) {
        // This will pass if the article doesnt have an image so no error logging
    }

    const responseData = { name: name, imageURL: imageURL };
    res.json(responseData);
});

// const fetchCharInfo = async (uriName) => {
//     const url = `https://starwars.fandom.com/api.php?page=${uriName}&format=json&action=parse&prop=displaytitle`;
//     let name = ""

//     try {
//         const response = await axios.get(url);
//         name = response.data.parse.title


        // // Parse JSON data from the response
        // const data = response.data;
        // // Extract the relevant data
        // const pageTitle = data.parse.title;

        // // Fetch image data
        // const imageResponse = await fetchImage(uriName);
        // const imageJSON = imageResponse.data;

        // // Extract the imageURL
        // let imageURL = imageJSON.image.imageserving;
        // imageURL = imageURL.replace(/(\.(png|jpe?g)).*/i, '$1');

        // Return the parsed data
//     } catch (error) {
//         console.error(error);;
//     }

//     return { name: name, imageURL: imageURL };
// }

// const fetchImage = async (uriName) => {
//     const url = `https://starwars.fandom.com/api.php?action=imageserving&wisTitle=${uriName}&format=json`;

//     try {
//         const response = await axios.get(url);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// }



// function fetchName(uriName) {
//     const url = `https://starwars.fandom.com/api.php?page=${uriName}&format=json&action=parse&prop=displaytitle`;
//     console.log(app.get(url));
//     return app.get(url, (response) => {
//         // let data = '';

//         // response.on('data', (chunk) => {
//         //     data += chunk;
//         //     console.log(data);
//         // });

//         // response.on('end', () => {
//         //     resolve({
//         //         data: data
//         //     });
//         // });
//         response.json()
//     })
// }

// async function fetchName(uriName) {
//     return new Promise((resolve, reject) => {
//         const url = `https://starwars.fandom.com/api.php?page=${uriName}&format=json&action=parse&prop=displaytitle`;
//         return app.get(url, (response) => {
//             let data = "";

//             response.on('data', (chunk) => {
//                 data += chunk;
//             });

//             response.on('end', () => {
//                 resolve({
//                     data: JSON.parse(data)
//                 });
//             });
//         }).on('error', (error) => {
//             reject(error);
//         });
//     });
// }

// async function fetchImage(uriName) {
//     return new Promise((resolve, reject) => {
//         const url = `https://starwars.fandom.com/api.php?action=imageserving&wisTitle=${uriName}&format=json`;
//         app.get(url, (response) => {
//             let data = '';

//             response.on('data', (chunk) => {
//                 data += chunk;
//             });

//             response.on('end', () => {
//                 resolve({
//                     status: response.statusCode,
//                     data: data
//                 });
//             });
//         }).on('error', (error) => {
//             reject(error);
//         });
//     });
// }

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
