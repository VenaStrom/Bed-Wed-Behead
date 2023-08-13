import express from 'express'
const app = express()
const port = 3000

app.get('/scrape', (request, response) => {

    const characterName = request.url.replace("/scrape?", "")
    const chracterURL = "https://starwars.fandom.com/wiki/" + characterName
    console.log(chracterURL);

    response.send("data")
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})