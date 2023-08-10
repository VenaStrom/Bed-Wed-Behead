import requests
import json


def getPage(api):
    response = requests.get(f'{api}')

    if response.status_code == 200:
        print("Successful call")
        with open("dumps/dump.json", "w") as file:
            file.write(
                response.text
            )
            pass
    else:
        print(f'Something went wrong. Error code {response.status_code}')


getPage("https://starwars.fandom.com/api.php?action=infobox&title=Droids%20with%20no%20genderprogramming")
# getPage("https://starwars.fandom.com/api.php?action=infobox&page=Category:Droids_with_no_gender_programming")
# getPage("https://starwars.fandom.com/api.php?action=parse&page=Category:Individuals&format=json")

# with open("dumps/dump.json") as file:
#     print(json.load(file))
