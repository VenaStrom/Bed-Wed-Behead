

document.addEventListener("keydown", event => {
    if (event.key == " " || event.key == "Enter") {
        event.preventDefault()

        if (event.target.parentElement.classList[0] == "iconWrapper") {
            select(event.target, event.target.id)

        } else if (event.target.id.includes("TextInput") && event.key != "Enter") {
            event.target.value += " "

        } else if (event.target.type == "checkbox") {
            event.target.checked = !event.target.checked
            updateConfig()

        } else if (event.target.classList.contains("resetTextInput")) {
            resetTextInput()
            updateConfig()

        } else if (event.target.id == "gearIcon") {
            toggleConfigMenu()

        }
    }
})

for (let index = 1; index <= 3; index++) {
    window.localStorage.setItem("bed" + index.toString(), false)
    window.localStorage.setItem("wed" + index.toString(), false)
    window.localStorage.setItem("behead" + index.toString(), false)
}

const select = (srcElement, id) => {
    if (srcElement.classList.contains("selected")) {
        srcElement.classList.remove("selected")
        window.localStorage.setItem(id, false)
        return
    }

    if (id.includes("bed")) {
        window.localStorage.setItem("bed1", false)
        window.localStorage.setItem("bed2", false)
        window.localStorage.setItem("bed3", false)
        window.localStorage.setItem(id, true)
    } else if (id.includes("wed")) {
        window.localStorage.setItem("wed1", false)
        window.localStorage.setItem("wed2", false)
        window.localStorage.setItem("wed3", false)
        window.localStorage.setItem(id, true)
    } else if (id.includes("behead")) {
        window.localStorage.setItem("behead1", false)
        window.localStorage.setItem("behead2", false)
        window.localStorage.setItem("behead3", false)
        window.localStorage.setItem(id, true)
    }
    if (id.includes("1")) {
        window.localStorage.setItem("bed1", false)
        window.localStorage.setItem("wed1", false)
        window.localStorage.setItem("behead1", false)
        window.localStorage.setItem(id, true)
    } else if (id.includes("2")) {
        window.localStorage.setItem("wed2", false)
        window.localStorage.setItem("bed2", false)
        window.localStorage.setItem("behead2", false)
        window.localStorage.setItem(id, true)
    } else if (id.includes("3")) {
        window.localStorage.setItem("bed3", false)
        window.localStorage.setItem("wed3", false)
        window.localStorage.setItem("behead3", false)
        window.localStorage.setItem(id, true)
    }

    document.querySelectorAll(".iconWrapper div").forEach(element => {
        if (window.localStorage.getItem(element.id) == "false") {
            element.classList.remove("selected")
        } else {
            element.classList.add("selected")
        }
    })
}
