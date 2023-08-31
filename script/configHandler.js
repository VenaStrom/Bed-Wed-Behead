
// window.onload = (event) => {
//     if (Boolean(localStorage.getItem("configOpen")) == true) {
//         const aside = document.getElementById("configMenu");
    
//         aside.style.display = "grid";
//     }
//     console.log(localStorage.getItem("configOpen"));
//     if (localStorage.getItem("configOpen") == null) {
//         console.log(true);
//         localStorage.setItem("configOpen", false)

//         localStorage.setItem("filterImage", false)
//         localStorage.setItem("filterTest", false)
//     }
// }


const openConfig = () => {
    const aside = document.getElementById("configMenu");

    if (aside.style.display == "none") {
        localStorage.setItem("configOpen", true)
        aside.style.display = "grid";
    } else {
        localStorage.setItem("configOpen", false)
        aside.style.display = "none";
    }
}

// document.addEventListener("mousedown", (event) => {
//     if (localStorage.getItem("configOpen") && "mainSection" in event.target.classList) {
//         console.log(event.target.classList);
//     }
// })

document.addEventListener("keydown", (event) => {
    if (Boolean(localStorage.getItem("configOpen")) == true) {
        if (event.key == "Escape") {
            openConfig()
        }
    }
})


const toggleConfig = (srcElement) => {
    console.log(localStorage);
    const configId = srcElement.id
    console.log(!Boolean(localStorage.getItem(configId)));
    // localStorage.setItem(configId, Boolean(localStorage.getItem(configId)))
    console.log(localStorage);
}