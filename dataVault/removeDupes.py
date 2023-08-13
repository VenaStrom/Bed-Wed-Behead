import json

with open("dataVault/rawOutput.csv", "r") as file:
    rawList = file.read().split("\",\"")
    filterList = list(dict.fromkeys(rawList))

    with open("dataVault/filteredOutput.csv", "x") as output:
        output.write(json.dumps(filterList).replace("[\"\\", "").replace("\\\",\"]", "\","))
