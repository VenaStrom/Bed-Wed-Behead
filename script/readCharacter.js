
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

    const patternIDs = Object.keys(localStorage)

    for (let index = 0; index < patternIDs.length; index++) {
        const patternID = patternIDs[index]

        const patternPlusId = patternID.split("%pattern", 1)
        const checkboxID = patternPlusId[0]
        const pattern = localStorage.getItem(patternID).split("cat:")[1]
        if (
            pattern !== "" // Has a pattern
            && patternPlusId[1] !== "" // 
            && localStorage.getItem(checkboxID) === "checked" // Check if option is checked
            && data.categories.includes(pattern) // If it has a category that is included
        ) {
            console.log(false);
        } else {
            console.log(true);
            return true
        }
        return false
    }

    // if (data.imageURL ==== "" && localStorage.getItem("filterImage") ==== "unchecked") {
    //     return false;
    // }
    // if (data.name.toLowerCase().includes("unidentified") && localStorage.getItem("filterUnidentified") ==== "unchecked") {
    //     return false
    // }
    // if (data.name.toLowerCase().includes(localStorage.getItem("filterCustomMiscTextInput").toLowerCase()) && localStorage.getItem("filterCustomMisc") ==== "checked") {
    //     return false
    // }
    // return true;
};

const getRandomName = (checkAgainst, fullListNames) => {
    let uriName = fullListNames[Math.floor(Math.random() * fullListNames.length)];
    while (checkAgainst.includes(uriName)) {
        uriName = fullListNames[Math.floor(Math.random() * fullListNames.length)];
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
            element.classList.remove("selected")
            localStorage.setItem(element.id, "false")
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

    if (tryFetch) {

        alternatives.forEach((data, index) => {
            console.log(index === 0 ? ("Fetching", alternatives) : "");
            updateCharacterInfo(index, data)
        })

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

        localAlternatives.forEach((name, index) => {
            index === 0 ? console.log("Loading", localAlternatives) : undefined

            updateCharacterInfo(index, indexedList[name]);
        })
    }
};

play();
