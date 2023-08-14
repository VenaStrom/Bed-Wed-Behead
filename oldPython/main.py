import requests
import json
import re


def getPage(title):
    response = requests.get(f'https://starwars.fandom.com/api.php?page={title}&format=json&action=parse&prop=displaytitle')

    if response.status_code == 200:
        print("Successful call")
        with open("oldPython/dumps/dump.json", "w") as file:
            content = json.loads(response.text)
            print(content)
            title = content["parse"]["title"]
            
            imageGetURL = f'https://starwars.fandom.com/api.php?action=imageserving&wisTitle={title}&format=json'
            imageResponse = requests.get(imageGetURL)
            
            if response.status_code == 200:
                print("Successful call")
                imageContent = json.loads(imageResponse.text)
                imageURL = imageContent["image"]["imageserving"]
                imageURL = re.sub(r"(\.(png|jpe?g)).*", r"\1", imageURL, flags=re.I)
            else:
                print(
                    f'Something went wrong. Error code {response.status_code}')

            file.write(json.dumps({"title": title, "imageURL": imageURL}))
            pass
    else:
        print(f'Something went wrong. Error code {response.status_code}')


getPage("CT-5555")
