
// import axios from "axios";
// import fs from "fs";
// import plimit from "p-limit"

// const URLs = {
//     input: "dataVault/individuals/noDupes.csv",
//     output: "dataVault/individuals/testingNewQueries.json",
//     appendTo: ""
// };

// const fetchStuff = async (uriName, outputFile, index) => {
//     const categoriesUrl = `https://starwars.fandom.com/api.php?action=parse&page=${uriName}&prop=categories&format=json`;
//     const propertiesUrl = `https://starwars.fandom.com/api.php?action=parse&page=${uriName}&format=json&prop=properties`;

//     let title = "";
//     let imageURL = "";
//     let categories = [];

//     try {
//         const response = await axios.get(propertiesUrl);
//         console.log("[Prop Done]", index, uriName);

//         title = response.data.parse.title;
//         imageURL = JSON.parse(response.data.parse.properties[1]["*"])[0].data[0].data[0].url.replace(/(\.(png|jpe?g)).*/i, '$1');

//     } catch (error) {
//     }

//     try {
//         const response = await axios.get(categoriesUrl);
//         console.log("[Cat Done]", index, uriName);

//         response.data.parse.categories.forEach(categoyDict => {
//             categories.push(categoyDict["*"]);
//         });
//         categories = categories.toString().replace("Pages_using_DynamicPageList3_parser_function,", "");

//     } catch (error) {
//         console.error(error);
//     }


//     const data = `"${uriName}":{"name":"${title}","imageURL":"${imageURL}","categories":"${categories}"},`;
//     fs.appendFileSync(outputFile, data);
// };

// fs.promises.readFile(URLs.input, "utf-8")
//     .then((inputFile) => {
//         const uriNames = inputFile.replace(/"/g, "").replace(/ /g, "").split(",");
//         const uriNamesLength = uriNames.length - 1;
//         const span = [0, uriNamesLength];
//         const limit = plimit(1000)

//         const outputFile = fs.openSync(URLs.output, 'a');
//         // fs.writeFileSync(outputFile, "{");

//         const promises = uriNames
//             .slice(span[0], span[1])
//             .map(async (uriName, index) => {
//                 console.log(index, uriName);
//                 return limit(() => fetchStuff(uriName, outputFile, index))
//             });

//         return Promise.all(promises);
//     })
//     // .then(() => {
//     //     fs.appendFileSync(URLs.output, "}");
//     // })
//     .catch((error) => {
//         console.error("Main Error", error);
//     });




// !!!!!!
// 
// Append appearances to existing data
// 
// !!!!!!

import axios from "axios";
import fs from "fs";
import plimit from "p-limit"


const URLs = {
    input: "dataVault/individuals/testingIn.json",
    output: "dataVault/individuals/testingOut.json"
}

fs.promises.readFile(URLs.input, "utf-8")
    .then(async preIndexedList => {

        const preIndexedListKeys = Object.keys(JSON.parse(preIndexedList))
        const limit = plimit(1000)
        const baseURL = "https://starwars.fandom.com/api.php?"


        const fetchSection = async (sectionsURL) => {
            // console.warn("Fetch sections");
            const sectionsJSON = await axios.get(sectionsURL)
            // console.warn("[DONE] Fetch sections");
            return sectionsJSON
        }
        const fetchAppearance = async (appearanceURL) => {
            // console.warn("Fetching appearance");
            const appearanceJSON = await axios.get(appearanceURL)
            // console.warn("[DONE] Fetching appearance");
            return appearanceJSON
        }


        const output = JSON.parse(preIndexedList)
        const promises = preIndexedListKeys
            .map(async (uriName, index) => {
                await limit(async () => {
                    console.log("[BEGN]", index, uriName);

                    try {
                        const sectionsURL = baseURL + `action=parse&page=${uriName}&format=json&prop=sections`
                        const sectionsJSON = await fetchSection(sectionsURL)

                        let sectionIndex = ""
                        sectionsJSON.data.parse.sections.forEach(item => {
                            if (item.line === "Appearances") {
                                sectionIndex = item.index
                            }
                        })

                        const appearanceURL = baseURL + `action=parse&page=${uriName}&format=json&section=${sectionIndex}`
                        const appearanceJSON = await fetchAppearance(appearanceURL)

                        let templateAppearancesArray = []
                        appearanceJSON.data.parse.templates.forEach(templateObject => {
                            templateAppearancesArray.push(templateObject["*"])
                        });

                        let linksAppearancesArray = []
                        appearanceJSON.data.parse.links.forEach(linkObject => {
                            linksAppearancesArray.push(linkObject["*"])
                        });

                        const templateAppearances = JSON.stringify(templateAppearancesArray).replaceAll("Template:", "").replaceAll("\"", "").replace("[", "").replace("]", "")
                        const linksAppearances = JSON.stringify(linksAppearancesArray).replaceAll("\"", "").replace("[", "").replace("]", "")
                        
                        output[uriName].appearances = ""
                        output[uriName].templateAppearances = templateAppearances
                        output[uriName].linksAppearances = linksAppearances
                        
                        console.log("[DONE]", index, uriName);
                        
                    } catch (_) {
                        
                        output[uriName].appearances = ""
                        output[uriName].templateAppearances = ""
                        output[uriName].linksAppearances = ""

                        console.log("[MISS]", index, uriName);
                    }
                })
            })

        Promise.all(promises).then(() => {
            fs.promises.writeFile(URLs.output, JSON.stringify(output))
                .then(() => {
                    console.log("Output Written to:", URLs.output);
                })
        })
    })

