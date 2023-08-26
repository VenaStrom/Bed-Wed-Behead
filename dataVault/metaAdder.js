// import axios from "axios"
// import fs from "fs"
// import fetch from "node-fetch"

// const fetchStuff = async (uriName) => {

//     const url = {
//         name: `https://starwars.fandom.com/api.php?page=${uriName}&format=json&action=parse&prop=displaytitle`,
//         imageURL: `https://starwars.fandom.com/api.php?action=imageserving&wisTitle=${uriName}&format=json`
//     }

//     let name = ""
//     let imageURL = ""

//     console.log(uriName);

//     try {
//         const response = await axios.get(url.name)
//         name = response.data.parse.title
//     } catch (error) {
//         console.error("Name", error);
//     }

//     try {
//         const response = await axios.get(url.imageURL)
//         imageURL = response.data.image.imageserving
//         imageURL = imageURL.replace(/(\.(png|jpe?g)).*/i, '$1');
//     } catch (error) {
//         // This will pass if the article doesnt have an image so no error logging
//     }

//     return [name, imageURL];
// }



// fs.writeFileSync("dataVault/indexedList.json", "{", () => { })

// fs.promises.readFile("dataVault/filteredOutput.csv", "utf-8")
//     .then((inputFile) => {
//         const uriNames = inputFile.replaceAll("\"", "").replaceAll(" ", "").split(",")
//         const uriNamesLength = uriNames.length

//         const promises = uriNames.slice(0, 10).map(async (uriName) => {
//             return fetchStuff(uriName).then(([name, imageURL]) => {
//                 const data = `"${uriName}": {"name": "${name}", "imageURL": "${imageURL}"},`;
//                 fs.appendFileSync("dataVault/indexedList.json", data);
//             });
//         });

//         return Promise.all(promises);


//         for (let index = 0; index < 10; index++) {

//             const data = `${uriNames[index]}: ${fetchStuff(uriNames[index])},`

//             fs.appendFile("dataVault/indexedList.json", data, () => { })
//         }
//     })
//     .then(() => {
//         fs.writeFileSync("dataVault/indexedList.json", "}", () => { })
//     })


import axios from "axios";
import fs from "fs";
import https from "https"

const fetchStuff = async (uriName) => {
    const baseUrl = "https://starwars.fandom.com/api.php";
    const nameUrl = `${baseUrl}?page=${uriName}&format=json&action=parse&prop=displaytitle`;
    const imageURLUrl = `${baseUrl}?action=imageserving&wisTitle=${uriName}&format=json`;

    try {
        const nameResponse = await axios.get(nameUrl);
        const name = nameResponse.data.parse.title;

        let imageURL = "";
        try {
            const imageURLResponse = await axios.get(imageURLUrl,
                {
                    timeout: 60000,
                    httpsAgent: new https.Agent({ keepAlive: true })
                });

            imageURL = imageURLResponse.data.image.imageserving.replace(/(\.(png|jpe?g)).*/i, '$1');
        } catch (imageError) {
            // Handle this error or ignore it if the article doesn't have an image
        }

        return [name, imageURL];
    } catch (nameError) {
        console.error("Name Error", nameError);
        return ["Error", ""];
    }
};


fs.promises.readFile("dataVault/filteredOutput.csv", "utf-8")
    .then((inputFile) => {
        const uriNames = inputFile.replace(/"/g, "").replace(/ /g, "").split(",");
        const uriNamesLength = uriNames.length;
        let i = 0
        let first = true

        fs.writeFileSync("dataVault/indexedList.json", "{");

        const promises = uriNames.slice(1000, 2000).map((uriName) => {
            return fetchStuff(uriName).then(([name, imageURL]) => {
                const data = `"${uriName}": {"name": "${name}", "imageURL": "${imageURL}"}`;

                if (first) {
                    fs.appendFileSync("dataVault/indexedList.json", data);
                    first = false
                } else {
                    fs.appendFileSync("dataVault/indexedList.json", "," + data);
                }
                i++
                console.log(i, uriName);
            });
        });

        return Promise.all(promises);
    })
    .then(() => {
        fs.appendFileSync("dataVault/indexedList.json", "}");
    })
    .catch((error) => {
        console.error("Main Error", error);
    });
