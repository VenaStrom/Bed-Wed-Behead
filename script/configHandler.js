

const defineConfigOption = (name) => {
    if (window.localStorage.getItem("config") == null) {
        consolce.log("localStorage is missing");

        window.localStorage.setItem(name, "unchecked")
    }
    else if (window.localStorage.getItem(name) == "checked") {
        const checkbox = document.getElementById(name)
        checkbox.checked = true
    } if (window.localStorage.getItem(name).includes("TextInput") == "text") {
        const textBox = document.getElementById(name)
        textBox.value = window.localStorage.getItem(name)
    }
}


window.onload = (event) => {

    // Define local storage variables if not present
    if (window.localStorage.getItem("config") == null) {
        console.error("Config reopen error: localStorage is missing");
        window.localStorage.setItem("config", "closed")
    }

    // Add items here when you make another config
    defineConfigOption("filterImage")
    defineConfigOption("filterString")
    defineConfigOption("filterUnidentified")

    // Keep config open if necessary
    if (window.localStorage.getItem("config") == "open") {
        const configMenu = document.getElementById("configMenu");
        configMenu.style.display = "block";
        window.localStorage.setItem("config", "open")
    }

    // Add the toggle config function to the inputs
    // document.querySelectorAll("#configForm input[type=checkbox]").forEach(input => {
    //     input.onchange = "toggleConfig(this)"
    // });
}


// Opens and closes the config tab
const toggleConfigMenu = () => {
    const configMenu = document.getElementById("configMenu");

    if (configMenu.style.display == "none") {
        configMenu.style.display = "block";
        window.localStorage.setItem("config", "open")
    } else {
        configMenu.style.display = "none";
        window.localStorage.setItem("config", "closed")
    }
}


// Toggle a single config option
const toggleConfig = (srcElement) => {
    const configId = srcElement.id

    if (srcElement.checked == true) {
        window.localStorage.setItem(configId, "checked")
    } else {
        window.localStorage.setItem(configId, "unchecked")
    }
}

const updateConfig = () => {
    const configForm = document.forms["configForm"]
    const configInputs = {
        filterImage: configForm["filterImage"],
        filterUnidentified: configForm["filterUnidentified"],
        filterStringTextInput: configForm["filterStringTextInput"],
        filterString: configForm["filterString"],
    }

    Object.keys(configInputs).forEach(key => {

        const element = configInputs[key]

        if (element.type == "text") {
            // For the text field
            window.localStorage.setItem(key, element.value)
        } else if (element.checked) {
            window.localStorage.setItem(key, "checked")
        } else if (!element.checked) {
            window.localStorage.setItem(key, "unchecked")
        }
    })
}


// Closes the config menu if you press esc or click outside of menu
document.addEventListener("keydown", (event) => {
    if (window.localStorage.getItem("config") == "open" && event.key == "Escape") {
        toggleConfigMenu()
    }
})
// document.addEventListener("mousedown", (event) => {
//     if (window.localStorage.getItem("config") == "open") {
//         try {
//             if (
//                 event.target.nodeName != "H2" &&
//                 event.target.id != "gearIcon" &&
//                 event.target.id != "configMenu" &&
//                 event.target.id != "configForm" &&
//                 !event.target.classList.contains("configName") &&
//                 !event.target.classList.contains("configTextInput") &&
//                 !event.target.classList.contains("configCheckbox")
//             ) {
//                 toggleConfigMenu()
//             }
//         } catch (error) { }
//     }
// })