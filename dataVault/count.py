
with open("dataVault/ships/rawScrapeOutput.csv", "r") as file:
    print(file.read().count(","))
