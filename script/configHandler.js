
// DEBUG
document.addEventListener("keydown", (event) => {
    if (event.key == "u") {
        console.log("Cleared Localstorage");
        window.localStorage.clear()
    }
})


window.onload = (event) => {

    // Define local storage variables if not present
    if (window.localStorage.getItem("config") == null) {

        // if (window.localStorage.getItem("config") != "open" && window.localStorage.getItem("config") != "closed") {
        console.log("localStorage is missing");
        window.localStorage.setItem("config", "closed")

        // Add items here when you make another config
        window.localStorage.setItem("filterImage", "unchecked")
        window.localStorage.setItem("filterTest", "unchecked")
    }

    // Implement relevant config options
    if (window.localStorage.getItem("config") == "open") {
        const configMenu = document.getElementById("configMenu");
        configMenu.style.display = "grid";
        window.localStorage.setItem("config", "open")
    }
    if (window.localStorage.getItem("filterImage") == "checked"){
        const filterImageCheckbox = document.getElementById("filterImage")
        filterImageCheckbox.checked = true
    }
}


// Opens and closes the config tab
const toggleConfigMenu = () => {
    const configMenu = document.getElementById("configMenu");

    if (configMenu.style.display == "none") {
        configMenu.style.display = "grid";
        window.localStorage.setItem("config", "open")
    } else {
        configMenu.style.display = "none";
        window.localStorage.setItem("config", "closed")
    }
}


// Closes the config menu if you press esc (or click outside of menu)
document.addEventListener("keydown", (event) => {
    if (window.localStorage.getItem("config") == "open" && event.key == "Escape") {
        toggleConfigMenu()
    }
})
// document.addEventListener("mousedown", (event) => {
//     if (window.localStorage.getItem("config") == "open") {
//         console.log(event.target);
//         try {
//             if (event.target.id != "configMenu") {
//                 toggleConfigMenu()
//             }
//         } catch (error) { }
//     }
// })


const toggleConfig = (srcElement) => {
    const configId = srcElement.id
    
    if (srcElement.checked == true) {
        window.localStorage.setItem(configId, "checked")
    } else {
        window.localStorage.setItem(configId, "unchecked")
    }
}