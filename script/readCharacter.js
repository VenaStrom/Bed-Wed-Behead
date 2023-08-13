
fetch("dataVault/filteredOutput.csv")
    .then((result) => result.text())
    .then((text) => {

        const fullListOfIndividuals = text.replaceAll("\"","").replaceAll(" ", "").split(",")
        
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

        const headshots = document.querySelectorAll(".imageWrapper")
        headshots.forEach((element, index) => {
            element.href = "https://starwars.fandom.com/wiki/" + alternatives[index]
        })

        // testing()
    })
    .catch((error) => console.error(error))