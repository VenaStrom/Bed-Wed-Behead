
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
            if (response.parse && !titleFetched) {
                title = response.parse.title;
                titleFetched = true;
                checkCompletion();

            } else if (response.image.imageserving != undefined && !imageFetched) {
                imageURL = response.image.imageserving.replace(/(\.(png|jpe?g)).*/i, '$1');
                imageFetched = true;
                checkCompletion();

            } else {
                reject({ imageURL: "style/images/placeholder-alien.png", name: "Error" });
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


        const headshots = document.querySelectorAll(".imageWrapper");
        headshots.forEach(async (element, index) => {
            const title = alternatives[index];

            fetchCharacterInfo(title)
                .then((result) => {
                    console.log(result);

                    const URL = "https://starwars.fandom.com/wiki/" + title;
                    element.href = URL;
                    element.children[0].src = result.imageURL;
                    element.children[1].innerHTML = result.name;
                })
                .catch((error) => console.error(error))
        });
    })
    .catch((error) => console.error(error))


