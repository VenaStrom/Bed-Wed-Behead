
import fs from "fs"

fs.promises.readFile("./dataVault/individuals/preIndexedList.json", "utf-8")
    .then((inputFile) => {

        const input = JSON.parse(inputFile)
        const keys = Object.keys(input)
        let count = 0
        const names = []


        keys.forEach((key, index) => {
            const data = input[key]

            const dataCategories = data.categories
            const categoryInclude = (string) => {
                return dataCategories.includes(string)
            }


            const increment = () => {
                count++
                names.push(input[key].name)
            }
            increment.should = true
            // MISC
            // if (!(true && "tk" !== "" && data.name.toLowerCase().includes("tk"))) {
            //     increment.should = increment.should && false 
            // }
            if ((true && data.imageURL === "")) {
                increment.should = increment.should && false 
            }
            if ((true && data.name.toLowerCase().includes("unidentified"))) {
                increment.should = increment.should && false 
            }


            if (increment.should) {
                increment()
            }

            console.log(index, count);
        });

        console.log("\n", count, "Charcters passed the filter");
        console.log((count * 100 / keys.length).toFixed(1), "% of total \n");

        fs.promises.writeFile("./dataVault/countFilterOut.json", JSON.stringify(names))
    })

