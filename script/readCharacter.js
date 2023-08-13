
fetch("dataVault/filteredOutput.csv")
    .then((result) => result.text())
    .then((text) => {

        const fullListOfIndividuals = text.replaceAll("\"","").replaceAll(" ", "").split(",")
        
        document.getElementById("totalCharacterCount").innerHTML = fullListOfIndividuals.length - 1

        let alternatives = []
        let randomChar = fullListOfIndividuals[Math.floor(Math.random() * fullListOfIndividuals.length)]
        let i = 0
        while (randomChar.includes() == false && i < 3) {
            randomChar = fullListOfIndividuals[Math.floor(Math.random() * fullListOfIndividuals.length)]
            i++
            alternatives.push(randomChar)
        }

        console.log(alternatives);

        const headshots = document.querySelectorAll(".imageWrapper")
        headshots.forEach((element, index) => {
            element.href = "https://starwars.fandom.com/wiki/" + alternatives[index]
        })
    
    
    
    
        async function fetchDataFromBackend(url) {
            try {
              const response = await fetch(`/scrape?url=${encodeURIComponent(url)}`);
              const data = await response.json();
              console.log(data);
            } catch (error) {
              console.error(error);
            }
          }
          
          const targetUrl = "https://example.com"; // URL you want to scrape
          fetchDataFromBackend(targetUrl);
    
    
    
    
    })
    .catch((error) => console.error(error))