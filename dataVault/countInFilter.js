
import fs from "fs"

fs.promises.readFile("./dataVault/individuals/preIndexedList.json", "utf-8")
    .then((inputFile) => {

        const input = JSON.parse(inputFile)
        const keys = Object.keys(input)
        let count = 0
        const names = []


        keys.forEach(key => {
            const data = input[key]

            const dataCategories = data.categories
            const categoryInclude = (string) => {
                return dataCategories.includes(string)
            }

            // const femaleChecks = categoryInclude("Females") || categoryInclude("Individuals_with_she/her_pronouns") // Pronouns?
            // const maleChecks = categoryInclude("Males") || categoryInclude("Individuals_with_he/him_pronouns") || categoryInclude("Clone_troopers") || categoryInclude("Clone_scout_troopers") // Pronouns?
            // const otherGenderCheck = (!femaleChecks && !maleChecks) && (categoryInclude("Individuals_of_unspecified_gender") || categoryInclude("Individuals_with_zhe/zher_pronouns"))

            // if (otherGenderCheck && data.imageURL !== "") {
            if (data.name.toLowerCase().includes("unidentified")) {
                // if (data.imageURL === "") {
                count++
                names.push(input[key].name)
            }
            console.log(count);
        });

        console.log(count);
        console.log(names);
        fs.promises.writeFile("./dataVault/countFilterOut.json", JSON.stringify(names))
    })

