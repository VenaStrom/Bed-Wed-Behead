
# with open("dataVault/individuals/noDupes.csv", "r") as file:
        
#     data = file.read()
#     length = data.count(",") + 1
#     unidentified = data.count("Unidentified")
#     print("Length: " + str(length))
#     print("Unidentified: " + str(unidentified))
#     print("Ratio: " + str(int(unidentified*10000/length)/10000) + ":1")


import json

with open("dataVault/individuals/preIndexedList.json","r",encoding="utf-8") as jsonFile:
    with open("dataVault/individuals/noDupes.csv","r",encoding="utf-8") as csvFile:
        jsonKeys = list(dict.keys(json.loads(jsonFile.read())))
        csvKeys = csvFile.read().replace("\"","").split(",")
        
        count = 0
        missing = []
        for key in jsonKeys:
            if key in csvKeys and key in jsonKeys:
                count += 1
                print(count)
            else:
                missing.append(key)
        print(count)
        print(missing)