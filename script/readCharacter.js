
const filter = {
    image: true
}


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


        const setCharacter = async (uriName) => {
            fetch(`http://localhost:3000/api/getPage/${uriName}`)
                .then((response) => response.json())
                .then((data) => {
                    const index = alternatives.indexOf(uriName)

                    // Filters
                    if (data.imageURL == "" && !filter.image) {
                        data.imageURL = "style/images/placeholder-alien.png"
                    } else if (data.imageURL == "" && filter.image) {
                        return setCharacter()
                    }


                    console.log(index, data);

                    const imageWrapper = document.querySelectorAll(".imageWrapper")[index];

                    const URI = "https://starwars.fandom.com/wiki/" + uriName;
                    imageWrapper.href = URI;
                    imageWrapper.children[0].src = data.imageURL;
                    imageWrapper.children[1].innerHTML = data.name;
                })
        }

        alternatives.forEach(setCharacter(uriName))

    })
    .catch((error) => {
        console.error(error)

        // Read local pre-indexed list
        fetch("./dataVault/indexedList.json")
            .then((result) => result.text())
            .then((text) => {
                console.log(text);
                indexedList = JSON.parse(text)
                console.log(indexedList);


                let alternatives = [];
                let i = 0;
                const keys = Object.keys(indexedList)
                while (alternatives.length < 3 && i < keys.length) {
                    const randomChar = keys[Math.floor(Math.random() * keys.length)];

                    if (!alternatives.includes(randomChar)) {
                        alternatives.push(randomChar);
                    }

                    i++;
                }

                console.log(alternatives);

                const imageWrappers = document.querySelectorAll(".imageWrapper")

                imageWrappers.forEach((element) => {
                    const index = Array.prototype.indexOf.call(imageWrappers, element)
                    const title = alternatives[index]

                    const URL = "https://starwars.fandom.com/wiki/" + encodeURIComponent(title);
                    const linkElement = element;
                    const imageElement = element.querySelector(".image");
                    const nameElement = element.querySelector(".name");

                    linkElement.href = URL;
                    nameElement.innerHTML = indexedList[title][0]
                    if (indexedList[title][1] != "") {
                        imageElement.src = indexedList[title][1]
                    } else {
                        imageElement.src = "style/images/placeholder-alien.png"
                    }
                });
            })

    })
