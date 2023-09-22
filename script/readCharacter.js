
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


const filterCharacter = (data) => { // If true, let through
    return true
    
    const patternIDs = Object.keys(localStorage)

    const allGood = []
    patternIDs.forEach(patternID => {
        if (
            patternID.includes("%pattern")
            &&
            localStorage.getItem(patternID.replace("%pattern", "")) === "checked"
            &&
            !patternID.toLowerCase().includes("custom")
        ) {
            allGood.push(true)
        } else {
            allGood.push(false)
        }
    })


    let letThrough = true

    patternIDs.forEach(patternID => {
        if (!patternID.includes("%pattern")) { // Look at only the filter pattern entries in local storage
            return
        } else {

            const checkboxIDplusPattern = patternID
            const checkboxID = checkboxIDplusPattern.replace("%pattern", "")
            const checkboxStatus = localStorage.getItem(checkboxID)
            const pattern = localStorage.getItem(patternID)

            if (checkboxStatus === "unchecked") { // If the checkbox isn't checked, simply break 
                return
            }

            // In name
            if (pattern.includes("string:")) {

                const localPattern = pattern.replace("string:", "")
                if (
                    (localPattern === "filterImage" && data.imageURL === "") // If filter pattern equals "filterImage" and the image is missing, let through
                    ||
                    (localPattern === "filterUnidentified" && data.name.toLowerCase().contains("unidentified")) // If the filter pattern is "filterUnidentified" and the name includes "unidentified", let through
                ) {
                    return
                }
            }

            // Categories
            if (pattern.includes("category:")) {

                const goodCategories = []
                const badCategories = []
                const dataCategories = data.categories.split(",")

                pattern.replace("category:", "").split(",").forEach(category => {
                    if (category.includes("!")) {
                        badCategories.push(category)
                    } else {
                        goodCategories.push(category.replace("!", ""))
                    }
                })


                dataCategories.forEach(category => {
                    if (
                        !goodCategories.includes(category)
                        ||
                        badCategories.includes(category)
                    ) {
                        console.log("no!");
                        letThrough = false
                    }
                })
            }

            // Appearances
            if (pattern.includes("appearance:")) {
                const localPattern = pattern.replace("appearance:", "")
            }
        }
    })

    return letThrough
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
