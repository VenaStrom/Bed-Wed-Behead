
fetch("dataVault/testing.csv")
    .then((result) => result.text())
    .then((text) => {
        console.log(text);
    })
    .catch((error) => console.error(error))