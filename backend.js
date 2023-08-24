import express from "express";
import cors from "cors"
import axios from "axios"
const app = express();
const port = 3000;

app.use(cors({ origin: "http://127.0.0.1:5500" }))

app.get('/api/getPage/:uriName', async (req, res) => {
    const uriName = req.params.uriName
    const url = {
        name: `https://starwars.fandom.com/api.php?page=${uriName}&format=json&action=parse&prop=displaytitle`,
        imageURL: `https://starwars.fandom.com/api.php?action=imageserving&wisTitle=${uriName}&format=json`
    }

    let name = ""
    let imageURL = ""

    console.log(uriName);

    try {
        const response = await axios.get(url.name)
        name = response.data.parse.title
    } catch (error) {
        console.error("Name", error);
    }

    try {
        const response = await axios.get(url.imageURL)
        imageURL = response.data.image.imageserving
        imageURL = imageURL.replace(/(\.(png|jpe?g)).*/i, '$1');
    } catch (error) {
        // This will pass if the article doesnt have an image so no error logging
    }

    const responseData = { name: name, imageURL: imageURL };
    res.json(responseData);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
