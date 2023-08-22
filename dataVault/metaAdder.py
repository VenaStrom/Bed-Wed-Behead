import json
import requests
import re
import asyncio


def getTitleAndImage(name):
    title = ""
    imageURL = ""

    titleResponse = requests.get(
        f'https://starwars.fandom.com/api.php?page={name}&format=json&action=parse&prop=displaytitle')
    titleContent = json.loads(titleResponse.text)
    title = titleContent["parse"]["title"]

    imageResponse = requests.get(
        f'https://starwars.fandom.com/api.php?action=imageserving&wisTitle={name}&format=json')
    imageContent = json.loads(imageResponse.text)

    try:
        imageURL = imageContent["image"]["imageserving"]
        imageURL = re.sub(r"(\.(png|jpe?g)).*", r"\1", imageURL, flags=re.I)
    except:
        imageURL = ""
        pass

    return [title, imageURL]


async def main():
    with open("dataVault/filteredOutput.csv", "r") as inputFile:
        with open("dataVault/indexedList.json", "a") as outputFile:
            names = inputFile.readlines()
            names = names[0].replace("\"", "")[:-1].split(", ")
            names = ["B2-HA_series_super_battle_droid_(Christophsis)", "B2-HA_series_super_battle_droid_(Devaron)", "B2-X_Computer_Interface_Unit", "B3NK", "B4-N9", "B5-56", "Baffle", "Reelo_Baruk%27s_RA-7_protocol_droid", "Battered_protocol_droid", "BB-8", "BD-1", "BD-72", "BG-222", "BG-J38/Legends", "Billingsly", "BIX", "BL-17", "Blade_Master", "Blue_Max", "BLX-5", "Bo-Katan_Kryze%27s_footman_droid", "Bollux", "Bruce", "Bun-Dingo", "BV-1210", "BV-RJ", "BX-778",
                     "C-069", "C-21_Highsinger", "C-21_Highsinger/Legends", "C-3PO", "C-3PO/Legends", "C-3PX", "C-3TC", "C-9PO_(Brakiss)", "C-9PO_(Rhommamool)", "C1-10P", "C1-1KR", "C2-N2_(Barsen%27thor)", "C2-N2_(Voidhound)", "C2-R4", "C4-B1", "C4-ZX", "C5-D9", "C6-E3-GE3", "C7-E3-GE3", "C8-42-GE3", "C9-T9-GE3", "Ceeril%27s_bodyguard_droid", "CGR-80", "CH-33P", "CH-33Z", "Checksum", "CKO-171", "Cleaver", "Colossus_droid", "Compactor_droid", "COO-2180/Legends", "CR-8R"]

            for index, name in enumerate(names):
                output = f'{name}: {getTitleAndImage(name)}'
                print(output)
                outputFile.write(output)

asyncio.run(main())
