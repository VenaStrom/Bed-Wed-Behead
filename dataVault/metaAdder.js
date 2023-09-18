// import axios from "axios";
// import fs from "fs";
// import https from "https"

// const URLs = {
//     input: "dataVault/individuals/noDupes.csv",
//     output: "dataVault/individuals/testingNewQueries.json",
//     appendTo: ""
// }

// const fetchStuff = async (uriName) => {
//     // const baseUrl = "https://starwars.fandom.com/api.php";
//     // const nameUrl = `${baseUrl}?page=${uriName}&format=json&action=parse&prop=displaytitle`;
//     // const imageURLUrl = `${baseUrl}?action=imageserving&wisTitle=${uriName}&format=json`;

//     const categoriesUrl = `https://starwars.fandom.com/api.php?action=parse&page=${uriName}&prop=categories&format=json`
//     const propertiesUrl = `https://starwars.fandom.com/api.php?action=parse&page=${uriName}&format=json&prop=properties`

//     let title = ""
//     let imageURL = ""
//     let categories = []

//     try {
//         const response = await axios.get(propertiesUrl)

//         title = response.data.parse.title
//         imageURL = JSON.parse(response.data.parse.properties[1]["*"])[0].data[0].data[0].url.replace(/(\.(png|jpe?g)).*/i, '$1')

//     } catch (_) { }

//     try {
//         const response = await axios.get(categoriesUrl)

//         response.data.parse.categories.forEach(categoyDict => {
//             categories.push(categoyDict["*"])
//         });
//         categories = categories.toString().replace("Pages_using_DynamicPageList3_parser_function,", "")

//     } catch (_) { }

//     return [title, imageURL, categories]

//     try {
//         const nameResponse = await axios.get(nameUrl);
//         const name = nameResponse.data.parse.title;

//         let imageURL = "";
//         try {
//             const imageURLResponse = await axios.get(imageURLUrl,
//                 // {
//                 //     timeout: 6000000,
//                 //     httpsAgent: new https.Agent({ keepAlive: true })
//                 // }
//             );

//             imageURL = imageURLResponse.data.image.imageserving.replace(/(\.(png|jpe?g)).*/i, '$1');
//         } catch (_) { }

//         let categories = []
//         try {
//             const categoriesUrlResponse = await axios.get(categoriesUrl,
//                 // {
//                 //     timeout: 6000000,
//                 //     httpsAgent: new https.Agent({ keepAlive: true })
//                 // }
//             )
//             categoriesUrlResponse.data.parse.categories.forEach(categoyDict => {
//                 categories.push(categoyDict["*"])
//             });
//             categories = categories.toString().replace("Pages_using_DynamicPageList3_parser_function,", "")
//         } catch (_) { }

//         // Try other queries here
//         // Try other queries here
//         // Try other queries here


//         return [name, imageURL, categories];
//     } catch (nameError) {
//         console.error("Name Error", nameError);
//         return ["Error", "", ""];
//     }
// };


// fs.promises.readFile(URLs.input, "utf-8")
//     .then((inputFile) => {
//         const uriNames = inputFile.replace(/"/g, "").replace(/ /g, "").split(",");
//         const uriNamesLength = uriNames.length - 1;
//         const span = [0, 100]

//         let i = 0
//         let first = true

//         fs.writeFileSync(URLs.output, "{");

//         const promises = uriNames
//             .slice(span[0], span[1])
//             .map(async (uriName) => {
//                 return fetchStuff(uriName).then(([name, imageURL, categories]) => {
//                     const data = `"${uriName}":{"name":"${name}","imageURL":"${imageURL}","categories":"${categories}"}`;
//                     if (first) {
//                         fs.appendFileSync(URLs.output, data);
//                         first = false
//                     } else {
//                         fs.appendFileSync(URLs.output, "," + data);
//                     }
//                     i++
//                     console.log(i, uriName);
//                 });
//             });

//         return Promise.all(promises);
//     })
//     .then(() => {
//         fs.appendFileSync(URLs.output, "}");
//     })
//     .catch((error) => {
//         console.error("Main Error", error);
//     });


import axios from "axios";
import fs from "fs";
import https from "https";
import plimit from "p-limit"

const URLs = {
    input: "dataVault/individuals/noDupes.csv",
    output: "dataVault/individuals/testingNewQueries.json",
    appendTo: ""
};

const fetchStuff = async (uriName, outputFile, index) => {
    const categoriesUrl = `https://starwars.fandom.com/api.php?action=parse&page=${uriName}&prop=categories&format=json`;
    const propertiesUrl = `https://starwars.fandom.com/api.php?action=parse&page=${uriName}&format=json&prop=properties`;

    let title = "";
    let imageURL = "";
    let categories = [];

    try {
        const response = await axios.get(propertiesUrl);
        console.log("[Prop Done]", index, uriName);

        title = response.data.parse.title;
        imageURL = JSON.parse(response.data.parse.properties[1]["*"])[0].data[0].data[0].url.replace(/(\.(png|jpe?g)).*/i, '$1');

    } catch (error) {
    }

    try {
        const response = await axios.get(categoriesUrl);
        console.log("[Cat Done]", index, uriName);

        response.data.parse.categories.forEach(categoyDict => {
            categories.push(categoyDict["*"]);
        });
        categories = categories.toString().replace("Pages_using_DynamicPageList3_parser_function,", "");

    } catch (error) {
        console.error(error);
    }


    const data = `"${uriName}":{"name":"${title}","imageURL":"${imageURL}","categories":"${categories}"},`;
    fs.appendFileSync(outputFile, data);
};

fs.promises.readFile(URLs.input, "utf-8")
    .then((inputFile) => {
        const uriNames = inputFile.replace(/"/g, "").replace(/ /g, "").split(",");
        const uriNamesLength = uriNames.length - 1;
        const span = [0, 100];
        const limit = plimit(5)

        const outputFile = fs.openSync(URLs.output, 'a');
        // fs.writeFileSync(outputFile, "{");

        const promises = uriNames
            .slice(span[0], span[1])
            .map(async (uriName, index) => {
                console.log(index, uriName);
                return limit(() => fetchStuff(uriName, outputFile, index))
            });

        return Promise.all(promises);
    })
    // .then(() => {
    //     fs.appendFileSync(URLs.output, "}");
    // })
    .catch((error) => {
        console.error("Main Error", error);
    });
