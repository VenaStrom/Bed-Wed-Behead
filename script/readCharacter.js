
// const URLs = {
//     // noDupes: "dataVault/ships/noDupes.csv",
//     noDupes: "dataVault/individuals/noDupes.csv",
//     preIndexed: "dataVault/individuals/preIndexedList.json",
//     placeholderImage: "style/images/placeholder-alien.png"
// }



// const play = () => {
//     fetch(URLs.noDupes)
//         .then((result) => result.text())
//         .then((text) => {
//             document.querySelectorAll(".imageWrapper p").forEach(title => {
//                 title.innerHTML = "Fetching"
//             });

//             const fullListOfIndividuals = text.replaceAll("\"", "").replaceAll(" ", "").split(",")

//             document.getElementById("totalCharacterCount").innerHTML = fullListOfIndividuals.length - 1

//             const getRandomName = (checkAgainst) => {
//                 const names = fullListOfIndividuals
//                 let uriName = names[Math.floor(Math.random() * names.length)]
//                 while (checkAgainst.includes(uriName)) {
//                     uriName = names[Math.floor(Math.random() * names.length)];
//                 }

//                 return uriName
//             }

//             let alternatives = [];

//             while (alternatives.length < 3) {
//                 alternatives.push(getRandomName(alternatives))
//             }

//             console.log(alternatives);


//             const setCharacter = async (uriName, index) => {

//                 const filter = (data) => { // False is fine and true means it has catched something
//                     // Filter
//                     console.log(data);
//                     try {
//                         if (data.imageURL == "" && window.localStorage.getItem("filterImage") == "checked") {
//                             return true
//                         } else if (
//                             window.localStorage.getItem("filterUnidentified") == "checked"
//                             && data.name.includes("unidentified")
//                         ) {
//                             return true
//                         }
//                     } catch (error) { }



//                     return false
//                 }

//                 fetch(`http://localhost:3000/api/getPage/${uriName}`)
//                     .then((response) => response.json())
//                     .then((data) => {

//                         // Filters
//                         // Filters
//                         // Filters

//                         console.log(index, data);

//                         const imageWrapper = document.querySelectorAll(".imageWrapper")[index];

//                         const URL = "https://starwars.fandom.com/wiki/" + uriName;
//                         imageWrapper.href = URL;
//                         imageWrapper.children[0].src = data.imageURL;
//                         imageWrapper.children[1].innerHTML = data.name;

//                         // Kinda janky of a solution but it works for now
//                         setCharacter.breakFlag = true
//                     })
//                     .catch((error) => {

//                         // Kinda janky of a solution but it works for now
//                         if (setCharacter.breakFlag) {
//                             return
//                         } else {
//                             setCharacter.breakFlag = true
//                         }


//                         // Read local pre-indexed list
//                         fetch(URLs.preIndexed)
//                             .then((result) => result.text())
//                             .then((text) => {

//                                 indexedList = JSON.parse(text)

//                                 const getRandomName = (checkAgainst) => {
//                                     const keys = Object.keys(indexedList)
//                                     let uriName = keys[Math.floor(Math.random() * keys.length)]

//                                     while (checkAgainst.includes(uriName) && filter(indexedList[uriName])) {
//                                         uriName = keys[Math.floor(Math.random() * keys.length)];
//                                     }

//                                     return uriName
//                                 }

//                                 let alternatives = [];

//                                 while (alternatives.length < 3) {
//                                     alternatives.push(getRandomName(alternatives))
//                                 }

//                                 console.log(alternatives);


//                                 const setCharacter = async (uriName, index) => {
//                                     let data = indexedList[uriName]

//                                     if (data.imageURL == "") {
//                                         data.imageURL = URLs.placeholderImage
//                                     }

//                                     console.log(index, uriName);

//                                     const imageWrapper = document.querySelectorAll(".imageWrapper")[index];

//                                     const URL = "https://starwars.fandom.com/wiki/" + uriName;
//                                     imageWrapper.href = URL;
//                                     imageWrapper.children[0].src = data.imageURL;
//                                     imageWrapper.children[1].innerHTML = data.name;
//                                 }
//                                 alternatives.forEach((uriName, index) => { setCharacter(uriName, index) })
//                             })
//                     })
//             }
//             alternatives.forEach((uriName, index) => setCharacter(uriName, index))
//         })
// }

// play()

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
    const imageWrapper = document.querySelectorAll(".imageWrapper")[index];
    const URL = `https://starwars.fandom.com/wiki/${data.name}`;
    imageWrapper.href = URL;
    imageWrapper.children[0].src = data.imageURL || URLs.placeholderImage;
    imageWrapper.children[1].innerHTML = data.name;
};

const filterCharacter = (data) => {
    if (data.imageURL === "" && window.localStorage.getItem("filterImage") === "checked") {
        return true;
    } else if (
        window.localStorage.getItem("filterUnidentified") === "checked" &&
        data.name.includes("unidentified")
    ) {
        return true;
    }
    return false;
};

const getRandomName = (checkAgainst, names) => {
    let uriName = names[Math.floor(Math.random() * names.length)];
    while (checkAgainst.includes(uriName)) {
        uriName = names[Math.floor(Math.random() * names.length)];
    }
    return uriName;
};

const play = async () => {
    const text = await fetchText(URLs.noDupes);
    const fullListOfIndividuals = text.replaceAll("\"", "").replaceAll(" ", "").split(",");
    document.getElementById("totalCharacterCount").innerHTML = fullListOfIndividuals.length - 1;

    const alternatives = [];
    while (alternatives.length < 3) {
        alternatives.push(getRandomName(alternatives, fullListOfIndividuals));
    }

    console.log(alternatives);

    for (let i = 0; i < alternatives.length; i++) {
        const uriName = alternatives[i];
        try {
            const data = await fetchJSON(`http://localhost:3000/api/getPage/${uriName}`);
            if (!filterCharacter(data)) {
                updateCharacterInfo(i, data);
            }
        } catch (error) {
            const preIndexedListText = await fetchText(URLs.preIndexed);
            const indexedList = JSON.parse(preIndexedListText);
            alternatives.forEach((uriName, index) => {
                if (!alternatives.includes(uriName) && !filterCharacter(indexedList[uriName])) {
                    console.log("object");
                    updateCharacterInfo(index, indexedList[uriName]);
                }
            });
        }
    }
};

play();
