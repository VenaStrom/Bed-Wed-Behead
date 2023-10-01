
// 
// Takes in the noDupes list, prindexed list 
// and checks which noDupes entries are not present in preindexed.
// 
// It outputs a copy of noDupes with nonoverlapping entries removed.
// 
// You have to manually copy the output to noDupes.csv in order to update that list (due to safety).
// 

import fs from "fs"

const URLs = {
    noDupes: "./dataVault/individuals/noDupes.csv",
    preIndexed: "./dataVault/individuals/preIndexedList.json",
    diffOut: "./dataVault/individuals/testingIn.csv",
    noDupesOut: "./dataVault/individuals/noDupesCleaned.csv"
}

fs.promises.readFile(URLs.noDupes, "utf-8")
    .then(inputCSV => {
        fs.promises.readFile(URLs.preIndexed, "utf-8")
            .then(inputJSON => {
                const csvKeys = inputCSV.replaceAll("\"", "").split(",")
                const jsonKeys = Object.keys(JSON.parse(inputJSON))


                console.log("CSV: ", csvKeys.length);
                console.log("JSON: ", jsonKeys.length);
                console.log("Delta: ", csvKeys.length - jsonKeys.length);

                const missing = []

                csvKeys.forEach(key => {
                    if (!jsonKeys.includes(key)) {
                        missing.push(key)
                    }
                })

                console.log(missing);
                fs.promises.writeFile(URLs.diffOut, JSON.stringify(missing).replace("[", "").replace("]", ""), "utf-8")
                    .then(() => {

                        fs.promises.readFile(URLs.diffOut, "utf-8")
                            .then(diffNames => {
                                const noGoodNames = diffNames.replaceAll("\"", "").replace("[", "").replace("]", "").split(",")
                                fs.promises.readFile(URLs.noDupes, "utf-8")
                                    .then(noDupesFile => {
                                        const noDupes = noDupesFile.replaceAll("\"", "").replace("[", "").replace("]", "").split(",")

                                        const output = noDupes.filter((name) => {
                                            return !noGoodNames.includes(name)
                                        })

                                        fs.promises.writeFile(URLs.noDupesOut, JSON.stringify(output).replace("[", "").replace("]", ""), "utf-8")
                                        console.log(output);
                                    })
                            })
                    })
            })
    })