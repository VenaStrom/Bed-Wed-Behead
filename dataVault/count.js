
import fs from "fs"

fs.promises.readFile("./dataVault/individuals/noDupes.csv", "utf-8")
    .then(inputCSV => {
        fs.promises.readFile("./dataVault/individuals/preIndexedList.json", "utf-8")
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

                fs.promises.writeFile()
                console.log(missing);
            })
    })