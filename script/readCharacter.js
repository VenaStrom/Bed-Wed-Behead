
fetch("dataVault/filteredOutput.csv")
    .then((result) => result.text())
    .then((text) => {

        const fullListOfIndividuals = text.replaceAll("\"", "").replaceAll(" ", "").split(",")

        document.getElementById("totalCharacterCount").innerHTML = fullListOfIndividuals.length - 1

        let alternatives = []
        let randomChar = fullListOfIndividuals[Math.floor(Math.random() * fullListOfIndividuals.length)]
        let i = 0
        while (randomChar.includes() == false && i < 3) {
            randomChar = fullListOfIndividuals[Math.floor(Math.random() * fullListOfIndividuals.length)]
            i++
            alternatives.push(randomChar)
        }

        console.log(alternatives);

        async function getNameAndImage(title) {
            try {
                const response = await fetch(`https://viggostrom.github.io/bedWedBehead/backend.js:3000/getPage/${title}`);
                // const response = await fetch(`http://localhost:3000/getPage/${title}`);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error(error);
                return { title: "Error", imageURL: "" };
            }
        }

        const headshots = document.querySelectorAll(".imageWrapper")
        headshots.forEach((element, index) => {
            const title = alternatives[index]
            const result = getNameAndImage(title)
            console.log(result);
            const URL = "https://starwars.fandom.com/wiki/" + title
            element.href = URL
            element.children[0].src = result.imageURL
            element.children[1].innerHTML = result.name
        })
    })
    .catch((error) => console.error(error))