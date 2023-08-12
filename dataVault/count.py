with open("allEntriesUnfiltered.csv", "r") as file:
    print("allEntriesUnfiltered: " + file.readline().count(",")+1)

with open("testing.csv", "r") as file:
    print("testing: " + file.readline().count(",")+1)