
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
    const patternIDs = Object.keys(localStorage)

    let allUnchecked = true
    patternIDs.forEach(patternID => {
        if (
            patternID.includes("%pattern")
            &&
            localStorage.getItem(patternID.replace("%pattern", "")) === "checked"
        ) {
            allUnchecked = allUnchecked && false
        } else {
            allUnchecked = allUnchecked && true
        }
    })
    if (allUnchecked) {
        return true
    }

    const dataCategories = data.categories
    const categoryInclude = (string) => {
        return dataCategories.includes(string)
    }
    const dataAppearance = data.appearances
    const appearanceInclude = (string) => {
        return dataAppearance.includes(string)
    }
    const getChecked = (string) => {
        return localStorage.getItem(string) === "checked"
    }

    let letThrough = false

    // MISC
    if ((getChecked("filterImage") && data.imageURL === "")) {
        return true
    }
    if ((getChecked("filterUnidentified") && data.name.toLowerCase().includes("unidentified"))) {
        return true
    }
    if ((getChecked("filterCustomMisc") && data.name.toLowerCase().includes(localStorage.getItem("filterCustomMiscTextInput")) && localStorage.getItem("filterCustomMiscTextInput") !== "")) {
        return true
    }

    // STATUS
    if (getChecked("filterCanon") && categoryInclude("Canon_articles")) {
        return true
        letThrough = true
    }
    if (getChecked("filterLegends") && categoryInclude("Legends_articles")) {
        return true
        letThrough = true
    }
    if (getChecked("filterNonCanon") && categoryInclude("Non-canon_Legends_articles")) {
        return true
        letThrough = true
    }

    // GENDER
    const femaleChecks = categoryInclude("Females") || categoryInclude("Individuals_with_she/her_pronouns")
    if (getChecked("filterFemales") && femaleChecks) {
        return true
        letThrough = true
    }
    const maleChecks = categoryInclude("Males") || categoryInclude("Individuals_with_he/him_pronouns") || categoryInclude("Clone_troopers") || categoryInclude("Clone_scout_troopers")
    if (getChecked("filterMales") && maleChecks) {
        return true
        letThrough = true
    }
    const otherGenderCheck = (!femaleChecks && !maleChecks) && (categoryInclude("Individuals_of_unspecified_gender") || categoryInclude("Individuals_with_zhe/zher_pronouns"))
    if (getChecked("filterGenderless") && otherGenderCheck) {
        return true
        letThrough = true
    }

    // APPEARANCE
    if (getChecked("filterAhsoka") && appearanceInclude("Ahsoka (television series)")) {
        return true
        letThrough = true
    }
    if (getChecked("filterAndor") && appearanceInclude("Andor (television series)")) {
        return true
        letThrough = true
    }
    if (getChecked("filterObiWan") && appearanceInclude("Obi-Wan Kenobi (television series)")) {
        return true
        letThrough = true
    }
    if (getChecked("filterMandoBoba") && (appearanceInclude("The Mandalorian") || appearanceInclude("The Book of Boba Fett"))) {
        return true
        letThrough = true
    }
    if (getChecked("filterBadBatch") && appearanceInclude("Star Wars:The Bad Batch")) {
        return true
        letThrough = true
    }
    if (getChecked("filterRebels") && appearanceInclude("Star Wars Rebels")) {
        return true
        letThrough = true
    }
    if (getChecked("filterCloneWars") && appearanceInclude("Star Wars:The Clone Wars")) {
        return true
        letThrough = true
    }
    if (getChecked("filterSkywalkerRogue") &&
        (
            appearanceInclude("Rogue One:A Star Wars Story")
            ||
            appearanceInclude("Star Wars:Episode I The Phantom Menace")
            ||
            appearanceInclude("Star Wars:Episode II Attack of the Clones")
            ||
            appearanceInclude("Star Wars:Episode III Revenge of the Sith")
            ||
            appearanceInclude("Star Wars:Episode IV A New Hope")
            ||
            appearanceInclude("Star Wars:Episode V The Empire Strikes Back")
            ||
            appearanceInclude("Star Wars:Episode VI Return of the Jedi")
            ||
            appearanceInclude("Star Wars:Episode VII The Force Awakens")
            ||
            appearanceInclude("Star Wars:Episode VIII The Last Jedi")
            ||
            appearanceInclude("Star Wars:Episode IX The Rise of Skywalker")
        )
    ) {
        return true
        letThrough = true
    }


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

        // const localAlternatives = ["CT-5555","Ahsoka_Tano","Rafa_Martez"]
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
