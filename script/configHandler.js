
// const createFilter = (id, filterLabel, pattern, description = "") => {

//     // DOM Aspect

//     const configForm = document.getElementById("configForm")

//     const label = document.createElement("label")
//     label.setAttribute("for", id)
//     label.title = description
//     label.innerHTML = filterLabel

//     const input = document.createElement("input")
//     input.type = "checkbox"
//     input.id = id
//     input.classList.add("configCheckbox")

//     configForm.appendChild(label)
//     configForm.appendChild(input)


//     // Local Storage Aspect

//     if (window.localStorage.getItem("config") == null) {
//         console.error("localStorage is missing");
//         window.localStorage.setItem(id, "unchecked")
//     }

//     else if (window.localStorage.getItem(id) == "checked") {
//         input.checked = true

//     } else if (window.localStorage.getItem(id) == "unchecked") {
//         input.checked = false

//     } else if (id.includes("TextInput")) {
//         input.value = window.localStorage.getItem(id)
//     }

// }


// window.onload = (event) => {

//     if (window.localStorage.getItem("config") == null) {
//         console.error("Config reopen error: localStorage is missing");
//         window.localStorage.setItem("config", "closed")
//     }

//     createFilter("filterMale", "Males:", "category:male")

//     // Keep config open if necessary
//     if (window.localStorage.getItem("config") == "open") {
//         const configMenu = document.getElementById("configMenu");
//         configMenu.style.display = "block";
//         window.localStorage.setItem("config", "open")
//     }
// }


// // Opens and closes the config tab
// const toggleConfigMenu = (src) => {

//     // Rotate a diffrent direction every other time
//     if (!src.classList.contains("direction")) {
//         src.classList.toggle("direction")

//         src.classList.toggle("spinLeft")
//         setTimeout(() => {
//             src.classList.toggle("spinLeft")
//         }, 500);

//     } else {
//         src.classList.toggle("direction")

//         src.classList.toggle("spinRight")
//         setTimeout(() => {
//             src.classList.toggle("spinRight")
//         }, 500);
//     }


//     const configMenu = document.getElementById("configMenu");

//     if (configMenu.style.display == "none") {
//         configMenu.style.display = "block";
//         window.localStorage.setItem("config", "open")
//     } else {
//         configMenu.style.display = "none";
//         window.localStorage.setItem("config", "closed")
//     }
// }

// document.getElementById("configForm").addEventListener("submit", event => {
//     event.preventDefault()
// })


// const updateConfig = () => {
//     const configForm = document.forms["configForm"]
//     const configInputs = {
//         filterImage: configForm["filterImage"],
//         filterUnidentified: configForm["filterUnidentified"],
//         filterStringTextInput: configForm["filterStringTextInput"],
//         filterString: configForm["filterString"],
//     }

//     Object.keys(configInputs).forEach(key => {

//         const element = configInputs[key]

//         if (element.type == "text") {
//             window.localStorage.setItem(key, element.value)
//         } else if (element.checked) {
//             window.localStorage.setItem(key, "checked")
//         } else if (!element.checked) {
//             window.localStorage.setItem(key, "unchecked")
//         }
//     })
// }

// const resetTextInput = (textInput) => {
//     window.localStorage.setItem(textInput, "")
//     document.getElementById(textInput).value = ""
// }

// // Closes the config menu if you press esc or click outside of menu
// document.addEventListener("keydown", (event) => {
//     if (window.localStorage.getItem("config") == "open" && event.key == "Escape") {
//         toggleConfigMenu()
//     }
// })
// document.addEventListener("mousedown", (event) => {
//     if (window.localStorage.getItem("config") == "open") {
//         // try {
//         if (
//             event.target.nodeName != "H2" &&
//             event.target.id != "gearIcon" &&
//             event.target.id != "configMenu" &&
//             event.target.id != "configForm" &&
//             !event.target.classList.contains("configName") &&
//             !event.target.classList.contains("configTextInput") &&
//             !event.target.classList.contains("configCheckbox")
//         ) {
//             toggleConfigMenu()
//         }
//         // } catch (error) { }
//     }
// })


// Function to create a filter element in DOM and handle local storage
const createFilter = (id, filterLabel, pattern, description = "") => {

    // DOM Aspect

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.title = description;
    label.innerHTML = filterLabel;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.classList.add("configCheckbox");

    const configForm = document.getElementById("configForm");
    configForm.appendChild(label);
    configForm.appendChild(input);


    // Local Storage Aspect
    const localStorageValue = window.localStorage.getItem(id);

    if (localStorageValue == null) {
        console.error(id, "localStorage is missing");
        window.localStorage.setItem(id, "unchecked");

    } else if (localStorageValue === "checked") {
        input.checked = true;

    } else if (localStorageValue === "unchecked") {
        input.checked = false;

    } else if (id.includes("TextInput")) {
        input.value = localStorageValue;
    }
};

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
    return

    Object.keys(configInputs).forEach((key) => {
        const element = configInputs[key];

        if (element.type === "text") {
            window.localStorage.setItem(key, element.value);
        } else if (element.checked) {
            window.localStorage.setItem(key, "checked");
        } else if (!element.checked) {
            window.localStorage.setItem(key, "unchecked");
        }
    });
};

// Function to reset a text input in local storage and its corresponding value
const resetTextInput = (textInput) => {
    window.localStorage.setItem(textInput, "");
    document.getElementById(textInput).value = "";
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
        if (
            target.nodeName !== "H2"
            && target.id !== "gearIcon"
            && target.id !== "configMenu"
            && target.id !== "configForm"
            && target.parentElement.id !== "configMenu"
            && target.parentElement.id !== "configForm"
        ) {
            toggleConfigMenu();
        }
    }
});

// Run on window load
window.onload = (event) => {
    if (window.localStorage.getItem("config") === null) {
        console.error("Config reopen error: localStorage is missing");
        window.localStorage.setItem("config", "closed");
    }

    createFilter("filterMale", "Males:", "category:male");

    // Remeber if config was open or not
    if (window.localStorage.getItem("config") === "open") {
        const configMenu = document.getElementById("configMenu");
        configMenu.style.display = "block";
        window.localStorage.setItem("config", "open");
    }
};
