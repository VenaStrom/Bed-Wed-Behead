
const fetchCharacterInfo = async (pageTitle) => {
    return new Promise((resolve, reject) => {

        const apiEndpoint = "https://starwars.fandom.com/api.php";
        const titleParams = "action=parse&prop=displaytitle&title=" + encodeURIComponent(pageTitle) + "&callback=callback&format=json";
        const imageParams = "action=imageserving&wisTitle=" + encodeURIComponent(pageTitle) + "&callback=callback&format=json";

        const scriptTagTitle = document.createElement("script");
        const scriptTagImage = document.createElement("script");
        scriptTagTitle.src = apiEndpoint + "?" + titleParams
        scriptTagImage.src = apiEndpoint + "?" + imageParams

        let titleFetched = false;
        let imageFetched = false;
        let title = "";
        let imageURL = "";

        window.callback = function (response) {
            try {
                title = response.parse.title;

                titleFetched = true;
                checkCompletion();
            } catch (error) { }

            try {
                imageURL = response.image.imageserving.replace(/(\.(png|jpe?g)).*/i, '$1');

                imageFetched = true;
                checkCompletion();
            } catch (error) {

                imageURL = "style/images/placeholder-alien.png"
                imageFetched = true;
                checkCompletion();
            }
        };

        const checkCompletion = () => {
            if (titleFetched && imageFetched) {
                resolve({ imageURL: imageURL, name: title });
            }
        };

        document.body.appendChild(scriptTagTitle);
        document.body.appendChild(scriptTagImage);

        scriptTagTitle.remove()
        scriptTagImage.remove()
    })
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


        // const headshots = document.querySelectorAll(".imageWrapper");

        // headshots.forEach(async (element, index) => {
        //     const title = alternatives[index];

        //     await fetchCharacterInfo(title)
        //         .then((result) => {
        //             console.log(result);

        //             const URL = "https://starwars.fandom.com/wiki/" + title;
        //             element.href = URL;
        //             element.children[0].src = result.imageURL;
        //             element.children[1].innerHTML = result.name;
        //         })
        //         .catch((error) => console.error(error))
        // });

        const imageWrappers = document.querySelectorAll(".imageWrapper")

        const imageWrapper1 = imageWrappers[0]
        const imageWrapper2 = imageWrappers[1]
        const imageWrapper3 = imageWrappers[2]

        imageWrapper1.children[1].innerHTML = "Fetching"
        imageWrapper2.children[1].innerHTML = "Fetching"
        imageWrapper3.children[1].innerHTML = "Fetching"

        fetchCharacterInfo(alternatives[0])
            .then((result) => {
                imageWrapper1.href = "https://starwars.fandom.com/wiki/" + alternatives[0]
                imageWrapper1.children[0].src = result.imageURL
                imageWrapper1.children[1].innerHTML = result.name
            }).finally(() => {
                fetchCharacterInfo(alternatives[1])
                    .then((result) => {
                        imageWrapper2.href = "https://starwars.fandom.com/wiki/" + alternatives[1]
                        imageWrapper2.children[0].src = result.imageURL
                        imageWrapper2.children[1].innerHTML = result.name
                    }).finally(() => {
                        fetchCharacterInfo(alternatives[2])
                            .then((result) => {
                                imageWrapper3.href = "https://starwars.fandom.com/wiki/" + alternatives[2]
                                imageWrapper3.children[0].src = result.imageURL
                                imageWrapper3.children[1].innerHTML = result.name
                            })
                    })
            })

        // document.querySelectorAll(".imageWrapper").forEach(async (element) => {
        //     const title = alternatives[Array.prototype.indexOf.call(imageWrappers, element)]

        //     try {
        //         const result = await fetchCharacterInfo(title);

        //         const URL = "https://starwars.fandom.com/wiki/" + encodeURIComponent(title);
        //         const linkElement = element;
        //         const imageElement = element.querySelector(".image");
        //         const nameElement = element.querySelector(".name");

        //         linkElement.href = URL;
        //         imageElement.src = result.imageURL;
        //         nameElement.innerHTML = result.name;
        //     } catch (error) {
        //         console.error("An error occurred:", error);
        //     }
        // });

    })
    .catch((error) => console.error(error))


