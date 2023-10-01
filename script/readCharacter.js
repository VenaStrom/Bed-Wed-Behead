
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

    const dataCategories = data.categories
    const dataAppearance = data.appearances
    const isInCategory = (string) => { return dataCategories.includes(string) }
    const appearanceInclude = (string) => { return dataAppearance.includes(string) }
    const isChecked = (string) => { return localStorage.getItem(string) === "checked" }

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


    const returnFalse = (sender) => {
        console.log(false, sender, data.categories);
        return false
    }
    const returnTrue = (sender) => {
        console.log(true, sender, data.categories);
        return true
    }


    // MISC
    const customMiscText = localStorage.getItem("filterCustomMiscTextInput")
    if ((isChecked("filterCustomMisc") && customMiscText !== "")) {
        if (!data.name.toLowerCase().includes(customMiscText)) {
            return returnFalse("filterCustomMisc")
        }
    }
    if ((isChecked("filterImage") && data.imageURL === "")) {
        return returnFalse("filterImage")
    }
    if ((isChecked("filterUnidentified") && data.name.toLowerCase().includes("unidentified"))) {
        return returnFalse("filterUnidentified")
    }

    // STATUS
    if ((isChecked("filterCanon") && isInCategory("Canon_articles"))) {

        return returnTrue("filterCanon")
    }
    if ((isChecked("filterLegends") && isInCategory("Legends_articles"))) {

        return returnTrue("filterLegends")
    }
    if ((isChecked("filterNonCanon") && isInCategory("Non-canon_Legends_articles"))) {

        return returnTrue("filterNonCanon")
    }

    // GENDER
    const _femaleChecks = (
        isInCategory("Females")
        ||
        isInCategory("Individuals_with_she/her_pronouns")
        ||
        isInCategory("Droids_with_feminine_programming")
    )
    const _maleChecks =
        (
            isInCategory("Males")
            ||
            isInCategory("Individuals_with_he/him_pronouns")
            ||
            isInCategory("Droids_with_masculine_programming")
            ||
            isInCategory("Clone_troopers")
            ||
            isInCategory("Clone_scout_troopers")
        )
    const femaleChecks = (
        _femaleChecks
        &&
        !_maleChecks
    )
    const maleChecks = (
        _maleChecks
        &&
        !femaleChecks
    )
    const otherGenderCheck = (
        (
            !_femaleChecks
            &&
            !_maleChecks
        )
        // &&
        // (
        //     isInCategory("Non-binary_individuals")
        //     ||
        //     isInCategory("Genderless_individuals")
        //     ||
        //     isInCategory("Droids_with_no_gender_programming")
        //     ||
        //     isInCategory("Individuals_of_unspecified_gender")
        //     ||
        //     isInCategory("Droids_with_unspecified_gender_programming")
        //     ||
        //     isInCategory("Individuals_of_unidentified_gender")
        // )
    )
    if ((isChecked("filterFemales") && femaleChecks)) {

        return returnTrue("filterFemales")
    }
    if ((isChecked("filterMales") && maleChecks)) {

        return returnTrue("filterMales")
    }
    if ((isChecked("filterGenderless") && otherGenderCheck)) {

        return returnTrue("filterGenderless")
    }

    // APPEARANCE
    if ((isChecked("filterAhsoka") && appearanceInclude("Ahsoka (television series)"))) {

        return returnTrue("filterAhsoka")
    }
    if ((isChecked("filterAndor") && appearanceInclude("Andor (television series)"))) {

        return returnTrue("filterAndor")
    }
    if ((isChecked("filterObiWan") && appearanceInclude("Obi-Wan Kenobi (television series)"))) {

        return returnTrue("filterObiWan")
    }
    if ((isChecked("filterMandoBoba") && (appearanceInclude("The Mandalorian") || appearanceInclude("The Book of Boba Fett")))) {

        return returnTrue("filterMandoBoba")
    }
    if ((isChecked("filterBadBatch") && appearanceInclude("Star Wars:The Bad Batch"))) {

        return returnTrue("filterBadBatch")
    }
    if ((isChecked("filterRebels") && appearanceInclude("Star Wars Rebels"))) {

        return returnTrue("filterRebels")
    }
    if ((isChecked("filterCloneWars") && appearanceInclude("Star Wars:The Clone Wars"))) {

        return returnTrue("filterCloneWars")
    }
    if ((isChecked("filterSkywalkerRogue") &&
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
        ))
    ) {

        return returnTrue("filterSkywalkerRogue")
    }

    return false
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
