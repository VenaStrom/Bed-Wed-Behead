if (localStorage.getItem("configOpen") == null) {
    localStorage.setItem("configOpen", false)
}


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

// console.log(localStorage.getItem("configOpen"));
// if (localStorage.getItem("configOpen") == true) {
//     openConfig()
// }

// document.addEventListener("mousedown", (event) => {
//     if (localStorage.getItem("configOpen")) {
//         console.log(event.target.classList);
//     }
// })
