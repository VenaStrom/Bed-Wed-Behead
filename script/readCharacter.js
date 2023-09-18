
const URLs = {
    noDupes: "dataVault/individuals/noDupes.csv",
    preIndexed: "dataVault/individuals/preIndexedList.json",
    placeholderImage: "style/images/placeholder-alien.png",
};

const fetchText = async (url) => {
    const response = await fetch(url);
    return await response.text();
};

const fetchJSON = async (url) => {
    const response = await fetch(url);
    return await response.json();
};

const updateCharacterInfo = (index, data) => {
    console.log(index, data.name);

    const imageWrapper = document.querySelectorAll(".imageWrapper")[index];
    const URL = `https://starwars.fandom.com/wiki/${data.name}`;
    imageWrapper.href = URL;

    imageWrapper.children[0].src = data.imageURL || URLs.placeholderImage;

    imageWrapper.children[1].innerHTML = data.name;
};

const filterCharacter = (data) => { // If true, its fine 
    if (data.imageURL === "" && window.localStorage.getItem("filterImage") === "unchecked") {
        return false;
    }
    if (data.name.includes("unidentified") && window.localStorage.getItem("filterUnidentified") === "unchecked") {
        return false
    }
    return true;
};

const getRandomName = (checkAgainst, names) => {
    let uriName = names[Math.floor(Math.random() * names.length)];
    while (checkAgainst.includes(uriName)) {
        uriName = names[Math.floor(Math.random() * names.length)];
    }
    return uriName;
};

const showFetching = () => {
    const tiles = document.querySelectorAll(".imageWrapper")

    tiles.forEach(tile => {
        tile.href = "#"
        tile.children[0].src = URLs.placeholderImage
        tile.children[1].innerHTML = "Fetching..."
    })
}

const clearSelection = () => {
    try {
        document.querySelectorAll(".selected").forEach(element => {
            console.log(element);
            element.classList.remove("selected")
            window.localStorage.setItem(element.id, "false")
        })
    } catch (_) { }
}

const play = async () => {
    clearSelection()
    showFetching()

    const text = await fetchText(URLs.noDupes);
    const fullListOfIndividuals = text.replaceAll("\"", "").replaceAll(" ", "").split(",");
    document.getElementById("totalCharacterCount").innerHTML = fullListOfIndividuals.length - 1;

    let tryFetch = true
    const alternatives = [];
    try {
        while (tryFetch && alternatives.length < 3) {
            const name = getRandomName(alternatives, fullListOfIndividuals)
            const data = await fetchJSON(`http://localhost:3000/api/getPage/${name}`);
            if (filterCharacter(data)) {
                alternatives.push(data);
            }
        }
    } catch (_) {
        tryFetch = false
    }

    for (let index = 0; index < 3; index++) {
        if (tryFetch) {
            console.log(index == 0 ? ("Fetching", alternatives) : "");

            const data = alternatives[index]
            updateCharacterInfo(index, data);
        } else {

            tryFetch = false

            const indexedList = JSON.parse(await fetchText(URLs.preIndexed));
            const indexedListOfIndividuals = Object.keys(indexedList)

            const localAlternatives = []
            while (localAlternatives.length < 3) {
                const name = getRandomName(localAlternatives, indexedListOfIndividuals)
                const data = indexedList[name]
                if (filterCharacter(data)) {
                    localAlternatives.push(name);
                }
            }

            console.log(index == 0 ? ("Loading", localAlternatives) : "");

            updateCharacterInfo(index, indexedList[localAlternatives[index]]);
        }
    }
};

play();
