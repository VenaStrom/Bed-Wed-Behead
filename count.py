with open("links.csv", "r") as file:
    print(file.readline().count(",")+1)
