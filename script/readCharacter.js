
fetch("dataVault/filteredOutput.csv")
    .then((result) => result.text())
    .then((text) => {

        const fullListOfIndividuals = text.replaceAll("\"", "").replaceAll(" ", "").split(",")

        document.getElementById("totalCharacterCount").innerHTML = fullListOfIndividuals.length - 1


        let alternatives = [];
        let i = 0;
        while (alternatives.length < 3 && i < fullListOfIndividuals.length) {
            const randomChar = fullListOfIndividuals[Math.floor(Math.random() * fullListOfIndividuals.length)];

            if (!alternatives.includes(randomChar)) {
                alternatives.push(randomChar);
            }

            i++;
        }

        console.log(alternatives);


        async function fetchCharacterInfo(pageURL) {
            try {
                const response = await fetch(`https://starwars.fandom.com/api.php?page=${pageURL}&format=json&action=parse&prop=displaytitle&origin=https://viggostrom.github.io/bedWedBehead/`, { "method": "GET", "credentials": "include" });
                const content = await response.json();
                const pageTitle = content.parse.title;

                const imageResponse = await fetch(`https://starwars.fandom.com/api.php?action=imageserving&wisTitle=${pageTitle}&format=json&origin=https://viggostrom.github.io/bedWedBehead/`, { "method": "GET", "credentials": "include" });
                const imageContent = await imageResponse.json();
                let imageURL = imageContent.image.imageserving;
                imageURL = imageURL.replace(/(\.(png|jpe?g)).*/i, '$1');

                return { imageURL: imageURL, name: pageTitle };
            } catch (error) {
                console.error(error);
                return { imageURL: "", name: "Error"};
            }
        }

        const headshots = document.querySelectorAll(".imageWrapper");
        headshots.forEach(async (element, index) => {
            const title = alternatives[index];
            const URL = "https://starwars.fandom.com/wiki/" + title;
            const result = await fetchCharacterInfo(URL);

            element.href = URL;
            element.children[0].src = result.imageURL;
            element.children[1].innerHTML = result.name;
        });



        // async function updateImageAndName(element, title) {
        //     try {
        //         element.href = "https://starwars.fandom.com/wiki/" + title

        //         console.log("Request sent");
        //         const response = await fetch(`http://localhost:3000/getPage/${encodeURIComponent(title)}`);
        //         const result = await response.json();
        //         console.log("Request fulfilled");

        //         element.children[0].src = result.imageURL
        //         element.children[1].innerHTML = result.name
        //     } catch (error) {
        //         console.error(error);
        //         return { title: "Error", imageURL: "" };
        //     }
        // }

        // const headshots = document.querySelectorAll(".imageWrapper")
        // headshots.forEach((element, index) => {
        //     const title = alternatives[index]
        //     updateImageAndName(element, title)
        // })
    })
    .catch((error) => console.error(error))