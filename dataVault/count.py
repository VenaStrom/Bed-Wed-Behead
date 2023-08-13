
with open("dataVault/filteredOutput.csv", "r") as file:
    print(file.read().count(","))
