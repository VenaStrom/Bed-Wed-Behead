
const filter = {
    image: true
}


fetch("dataVault/filteredOutput.csv")
    .then((result) => result.text())
    .then((text) => {

        const fullListOfIndividuals = text.replaceAll("\"", "").replaceAll(" ", "").split(",")

        document.getElementById("totalCharacterCount").innerHTML = fullListOfIndividuals.length - 1


        const getRandomName = (checkAgainst) => {
            const names = fullListOfIndividuals
            let uriName = names[Math.floor(Math.random() * names.length)]
            while (checkAgainst.includes(uriName)) {
                uriName = names[Math.floor(Math.random() * names.length)];
            }

            return uriName
        }

        let alternatives = [];

        while (alternatives.length < 3) {
            alternatives.push(getRandomName(alternatives))
        }

        console.log(alternatives);


        const setCharacter = async (uriName, index) => {
            fetch(`http://localhost:3000/api/getPage/${uriName}`)
                .then((response) => response.json())
                .then((data) => {

                    // Filters
                    if (data.imageURL == "" && !filter.image) {
                        data.imageURL = "style/images/placeholder-alien.png"
                    } else if (data.imageURL == "" && filter.image) {
                        return setCharacter(getRandomName(alternatives), index)
                    }


                    console.log(index, data);

                    const imageWrapper = document.querySelectorAll(".imageWrapper")[index];

                    const URL = "https://starwars.fandom.com/wiki/" + uriName;
                    imageWrapper.href = URL;
                    imageWrapper.children[0].src = data.imageURL;
                    imageWrapper.children[1].innerHTML = data.name;
                })

                .catch((error) => {
                    // Read local pre-indexed list
                    fetch("./dataVault/indexedList.json")
                        .then((result) => result.text())
                        .then((text) => {
                            indexedList = JSON.parse(text)

                            const getRandomName = (checkAgainst) => {
                                const keys = Object.keys(indexedList)
                                let uriName = keys[Math.floor(Math.random() * keys.length)]
                                while (checkAgainst.includes(uriName)) {
                                    uriName = keys[Math.floor(Math.random() * keys.length)];
                                }

                                return uriName
                            }

                            let alternatives = [];

                            while (alternatives.length < 3) {
                                alternatives.push(getRandomName(alternatives))
                            }

                            console.log(alternatives);


                            const setCharacter = async (uriName, index) => {
                                const data = indexedList[uriName]

                                // Filters
                                try {
                                    if (data.imageURL == "" && !filter.image) {
                                        data.imageURL = "style/images/placeholder-alien.png"
                                    } else if (data.imageURL == "" && filter.image) {
                                        return setCharacter(getRandomName(alternatives), index)
                                    }
                                } catch (error) {

                                }

                                console.log(index, uriName);

                                const imageWrapper = document.querySelectorAll(".imageWrapper")[index];

                                const URL = "https://starwars.fandom.com/wiki/" + uriName;
                                imageWrapper.href = URL;
                                imageWrapper.children[0].src = data.imageURL;
                                imageWrapper.children[1].innerHTML = data.name;
                            }


                            alternatives.forEach((uriName, index) => { setCharacter(uriName, index) })
                        })

                })
        }

        alternatives.forEach((uriName, index) => setCharacter(uriName, index))

    })