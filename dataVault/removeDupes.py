

import json

with open("dataVault/ships/rawScrapeOutput.csv", "r") as file:
    rawList = file.read().split(",")
    filterList = list(dict.fromkeys(rawList))

    with open("dataVault/ships/noDupes.csv", "w") as output:
        output.write(json.dumps(filterList).replace("\\", "").replace("\"\"","").replace(" ", "").replace("[","").replace("]",""))
