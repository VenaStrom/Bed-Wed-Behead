

const defineConfigOption = (name) => {
    if (window.localStorage.getItem("config") == null) {
        consolce.log("localStorage is missing");

        window.localStorage.setItem(name, "unchecked")
    }
    else if (window.localStorage.getItem(name) == "checked") {
        const checkbox = document.getElementById(name)
        checkbox.checked = true
    } else if (window.localStorage.getItem(name) == "unchecked") {
        const checkbox = document.getElementById(name)
        checkbox.checked = false
    } else if (name.includes("TextInput")) {
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
    defineConfigOption("filterStringTextInput")
    defineConfigOption("filterUnidentified")

    // Keep config open if necessary
    if (window.localStorage.getItem("config") == "open") {
        const configMenu = document.getElementById("configMenu");
        configMenu.style.display = "block";
        window.localStorage.setItem("config", "open")
    }
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

document.getElementById("configForm").addEventListener("submit", event => {
    event.preventDefault()
})


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
            window.localStorage.setItem(key, element.value)
        } else if (element.checked) {
            window.localStorage.setItem(key, "checked")
        } else if (!element.checked) {
            window.localStorage.setItem(key, "unchecked")
        }
    })
}

const resetTextInput = (src, textInput) => {
    if (!src.classList.contains("spin")) {
        src.classList.toggle("spin")
        setTimeout(() => {
            src.classList.toggle("spin")
        }, 500);
    }
    window.localStorage.setItem(textInput, "")
    document.getElementById(textInput).value = ""
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