
with open("dataVault/ships/noDupes.csv", "r") as file:
    data = file.read()
    length = data.count(",") + 1
    unidentified = data.count("Unidentified")
    print("Length: " + str(length))
    print("Unidentified: " + str(unidentified))
    print("Ratio: " + str(unidentified/length))
