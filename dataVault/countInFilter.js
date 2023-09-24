
import fs from "fs"

fs.promises.readFile("./dataVault/individuals/preIndexedList.json", "utf-8")
    .then((inputFile) => {

        const input = JSON.parse(inputFile)
        const keys = Object.keys(input)
        let count = 0
        const names = []

        keys.forEach(key => {
            const data = input[key]
            if (
                !(
                    // Negative block
                    data.name.toLowerCase().includes("unidentified")
                    &&
                    data.imageURL === ""
                    &&
                    data.categories.split(",").includes("Grand_Army_of_the_Republic_ranks")
                    &&
                    data.categories.split(",").includes("Titles_of_nobility")
                )
                &&
                (
                    // Postive block
                    (
                        // OR block
                        data.linksAppearances.split(",").includes("Star Wars: The Clone Wars")
                        ||
                        data.linksAppearances.split(",").includes("Star Wars: The Bad Batch")
                    )
                    &&
                    data.categories.split(",").includes("Canon_articles")
                )
            ) {
                count++
                names.push(input[key].name)
            } else { }

            console.log(count);
        });

        console.log(count);
        console.log(names);
        // names.forEach(name => console.log(name))
    })