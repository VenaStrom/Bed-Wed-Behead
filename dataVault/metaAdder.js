import axios from "axios";
import fs from "fs";
import https from "https"

URLs = {
    input: "dataVault/individuals/noDupes.csv",
    output: "dataVault/individuals/testingNewQueries.json"
}

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
                    timeout: 6000000,
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


fs.promises.readFile(URLs.input, "utf-8")
    .then((inputFile) => {
        const uriNames = inputFile.replace(/"/g, "").replace(/ /g, "").split(",");
        const uriNamesLength = uriNames.length - 1;
        let i = 0
        let first = true

        fs.writeFileSync(URLs.output, "{");

        const promises = uriNames.slice(0, uriNamesLength).map((uriName) => {
            return fetchStuff(uriName).then(([name, imageURL]) => {
                const data = `"${uriName}": {"name": "${name}", "imageURL": "${imageURL}"}`;

                if (first) {
                    fs.appendFileSync(URLs.output, data);
                    first = false
                } else {
                    fs.appendFileSync(URLs.output, "," + data);
                }
                i++
                console.log(i, uriName);
            });
        });

        return Promise.all(promises);
    })
    // Append a smaller sample to a larger file
    // .then(() => {
    //     fs.appendFileSync("dataVault/ships/preIndexedList.json", "}");
    // })
    .catch((error) => {
        console.error("Main Error", error);
    });
