import fs from "fs"
import fetch from "node-fetch"


const fetchTitleAndImage = (uriName) => {
    let title = ""
    let imageURL = ""

    fetch(`https://starwars.fandom.com/api.php?page=${uriName}&format=json&action=parse&prop=displaytitle`)
        .then((result) => result.text())
        .then((titleResponse) => {
            title = json.parse(titleResponse).parse.title
        })

    fetch(`https://starwars.fandom.com/api.php?action=imageserving&wisTitle=${uriName}&format=json`)
        .then((result) => result.text())
        .then((imageResponse) => {
            try {
                imageURL = json.parse(imageResponse).image.imageserving.replace(/(\.(png|jpe?g))[^/]*$/i, '$1')
            } catch (error) {
                imageURL = ""
            }
        })

    return [title, imageURL]
}


fs.writeFile("dataVault/indexedList.json", "{", () => { })

fetch("dataVault/filteredOutput.csv")
    .then((result) => result.text())
    .then((inputFile) => {
        const uriNames = inputFile.replaceAll("\"", "").replaceAll(" ", "").split(",")

        for (let index = 0; index < 10; index++) {

            const data = `${uriNames[index]}: ${fetchTitleAndImage(uriNames[index])},`
            fs.appendFile("dataVault/indexedList.json", data, () => { })
        }
    })

fs.writeFile("dataVault/indexedList.json", "}", () => { })