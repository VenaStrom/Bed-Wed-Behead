
// Function to toggle the configuration menu
const toggleConfigMenu = () => {

    // Rotate a different direction every other time
    const gearIcon = document.getElementById("gearIcon")

    if (!gearIcon.classList.contains("direction")) {
        gearIcon.classList.toggle("direction");

        gearIcon.classList.toggle("spinLeft");
        setTimeout(() => {
            gearIcon.classList.toggle("spinLeft");
        }, 500);
    } else {
        gearIcon.classList.toggle("direction");

        gearIcon.classList.toggle("spinRight");
        setTimeout(() => {
            gearIcon.classList.toggle("spinRight");
        }, 500);
    }

    const configMenu = document.getElementById("configMenu");
    const configState = configMenu.style.display === "none" ? "open" : "closed";

    configMenu.style.display = configState === "open" ? "block" : "none";
    window.localStorage.setItem("config", configState);
};

// Function to update configuration settings in local storage
const updateConfig = () => {
    const configFormCheckboxes = document.querySelectorAll("#configForm input[type=checkbox]")

    // Checkboxes
    configFormCheckboxes.forEach(checkbox => {
        window.localStorage.setItem(checkbox.id, checkbox.checked ? "checked" : "unchecked")
    })

    const configFormxTextInputs = document.querySelectorAll("#configForm input[type=text]")

    // Text fields
    configFormxTextInputs.forEach(textInput => {
        window.localStorage.setItem(textInput.id, textInput.value)
    })
};

// Event listener to close the config menu if you press Esc or click outside of the menu
document.addEventListener("keydown", (event) => {
    if (window.localStorage.getItem("config") === "open" && event.key === "Escape") {
        toggleConfigMenu();
    }
});
document.addEventListener("mousedown", (event) => {
    if (window.localStorage.getItem("config") === "open") {
        const { target } = event;
        try {
            if (
                target.id !== "gearIcon"
                && target.id !== "configMenu"
                && !target.closest("#configMenu")
            ) {
                toggleConfigMenu();
            }
        } catch (_) {
            toggleConfigMenu();
        }
    }
});

// Prevent the page from reloading when pressing enter on the text input
document.getElementById("configMenu").addEventListener("submit", event => {
    event.preventDefault()
})

const resetTextInput = (id) => {
    // Function to reset a text input in local storage and its corresponding value
    window.localStorage.setItem(id, "");
    document.getElementById(id).value = "";
}

// Function to create a filter element in DOM and handle local storage
const createFilter = (defaultValue, category, id, displayName, pattern, description = "") => {

    // DOM Aspect

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.title = description;
    label.innerHTML = displayName;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.title = description
    input.checked = defaultValue

    const parent = document.getElementById(category);
    if (id.toLowerCase().includes("custom")) {
        const textInput = document.createElement("input")
        textInput.type = "text"
        textInput.title = description
        textInput.id = id + "TextInput"
        textInput.placeholder = "Exclude this text"
        textInput.value = window.localStorage.getItem(textInput.id);

        const reset = document.createElement("img")
        reset.onclick = `resetTextInput(${textInput.id})`
        reset.title = "Clear the text."
        reset.src = "../style/images/icons/refresh_FILL0_wght600_GRAD0_opsz48.png"
        reset.classList.add("resetTextInput")
        reset.tabIndex = 0

        const textInputwrapper = document.createElement("div")
        textInputwrapper.classList.add("textInputWrapper")
        textInputwrapper.appendChild(reset)
        textInputwrapper.appendChild(textInput)

        const biggerWrapper = document.createElement("div")
        biggerWrapper.style.display = "flex"
        biggerWrapper.style.flexFlow = "row nowrap"
        biggerWrapper.style.alignContent = "center"
        biggerWrapper.classList.add("biggerTextInputWrapper")
        biggerWrapper.appendChild(label)
        biggerWrapper.appendChild(textInputwrapper)


        parent.after(biggerWrapper)
        parent.after(input);

    } else {
        parent.after(label);
        parent.after(input);
    }


    // Local Storage Aspect
    const localStorageValue = window.localStorage.getItem(id);

    if (localStorageValue == null) {
        console.error(id, "localStorage is missing");
        window.localStorage.setItem(id, defaultValue ? "checked" : "unchecked");
        window.localStorage.setItem(`${id}-${pattern}`, pattern);
    }
    if (localStorageValue === "checked") {
        input.checked = true;
    } else if (localStorageValue === "unchecked") {
        input.checked = false;
    }
};

// Run on window load
window.onload = () => {
    if (window.localStorage.getItem("config") === null) {
        console.error("Config reopen error: localStorage is missing");
        window.localStorage.setItem("config", "closed");
    }

    // Gender
    createFilter(
        defaultValue = true,
        category = "gender",
        id = "filterGenderless",
        displayName = "Neither of the above",
        pattern = "!category:male!category:female",
        description = "Include everything that is not tagged as a man or woman."
    )
    createFilter(
        defaultValue = true,
        category = "gender",
        id = "filterMale",
        displayName = "Males",
        pattern = "category:male",
        description = "Include men"
    )
    createFilter(
        defaultValue = true,
        category = "gender",
        id = "filterFemale",
        displayName = "Female",
        pattern = "category:female",
        description = "Include women"
    )
    // Miscellaneous
    createFilter(
        defaultValue = false,
        category = "miscellaneous",
        id = "filterCustomMisc",
        displayName = "Custom",
        pattern = "!string",
        description = "Exclude individuals with names that include this text."
    )
    createFilter(
        defaultValue = true,
        category = "miscellaneous",
        id = "filterUnidentified",
        displayName = "Unidentified",
        pattern = "!unidentified",
        description = "Include individuals which are tagged as unidentified."
    )
    createFilter(
        defaultValue = true,
        category = "miscellaneous",
        id = "filterImage",
        displayName = "Imageless",
        pattern = "!imageURL",
        description = "Include individuals that do not have an image associated with it."
    )
    // Status
    createFilter(
        defaultValue = true,
        category = "status",
        id = "filterNonCanon",
        displayName = "Non-canon",
        pattern = "category:non-canon",
        description = "Include non-canon individuals."
    )
    createFilter(
        defaultValue = true,
        category = "status",
        id = "filterLegends",
        displayName = "Legends",
        pattern = "category:legends",
        description = "Include legends individuals."
    )
    createFilter(
        defaultValue = true,
        category = "status",
        id = "filterCanon",
        displayName = "Canon",
        pattern = "category:canon",
        description = "Include canon individuals."
    )
    // Appearance
    createFilter(
        defaultValue = false,
        category = "appearance",
        id = "filterCustomAppearance",
        displayName = "Custom",
        pattern = "",
        description = "Enter name of media as it appears in the Appearances section of articles on Wookieepedia"
    )
    createFilter(
        defaultValue = true,
        category = "appearance",
        id = "filterAhsoka",
        displayName = "Ahsoka",
        pattern = "",
        description = "Include individuals who appeared in Ahsoka."
    )
    createFilter(
        defaultValue = true,
        category = "appearance",
        id = "filterAndor",
        displayName = "Andor",
        pattern = "",
        description = "Include individuals who appeared in Andor."
    )
    createFilter(
        defaultValue = true,
        category = "appearance",
        id = "filterObiWan",
        displayName = "Obi-Wan Kenobi",
        pattern = "",
        description = "Include individuals who appeared in Obi-Wan Kenobi."
    )
    createFilter(
        defaultValue = true,
        category = "appearance",
        id = "filterMandoBoba",
        displayName = "The Mandalorian & The Book of Boba Fett",
        pattern = "",
        description = "Include individuals who appeared in The Mandalorian & The Book of Boba Fett."
    )
    createFilter(
        defaultValue = true,
        category = "appearance",
        id = "filterBadBatch",
        displayName = "The Bad Batch",
        pattern = "",
        description = "Include individuals who appeared in The Bad Batch."
    )
    createFilter(
        defaultValue = true,
        category = "appearance",
        id = "filterRebels",
        displayName = "Rebels",
        pattern = "",
        description = "Include individuals who appeared in Rebels."
    )
    createFilter(
        defaultValue = true,
        category = "appearance",
        id = "filterCloneWars",
        displayName = "The Clone Wars",
        pattern = "",
        description = "Include individuals who appeared in The Clone Wars."
    )
    createFilter(
        defaultValue = true,
        category = "appearance",
        id = "filterSkywalkerRogue",
        displayName = "Skywalker saga & Rogue One",
        pattern = "",
        description = "Include individuals who appear in movies 1 - 9 & Rogue One"
    )

    // Remeber if config was open or not
    // if (window.localStorage.getItem("config") === "open") {
    //     const configMenu = document.getElementById("configMenu");
    //     configMenu.style.display = "block";
    //     window.localStorage.setItem("config", "open");
    // }
};
