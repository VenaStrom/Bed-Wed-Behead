

// Gender
createFilter(
    defaultValue = false,
    category = "gender",
    id = "filterGenderless",
    displayName = "Neither of the above",
    pattern = "category:Articles_with_unpopulated_pronoun_parameters,!Males,!Individuals_with_he/him_pronouns,!Females,!Individuals_with_she/her_pronouns",
    description = "Include everything that is not tagged as a man or woman."
)
createFilter(
    defaultValue = false,
    category = "gender",
    id = "filterMales",
    displayName = "Male characters",
    pattern = "category:Males,Individuals_with_he/him_pronouns,Clone_troopers",
    description = "Include men"
)
createFilter(
    defaultValue = false,
    category = "gender",
    id = "filterFemales",
    displayName = "Female characters",
    pattern = "category:Females,Individuals_with_she/her_pronouns",
    description = "Include women"
)

// Miscellaneous
createFilter(
    defaultValue = false,
    category = "miscellaneous",
    id = "filterCustomMisc",
    displayName = "Custom",
    pattern = "string:",
    description = "Exclude individuals with names that include this text."
)
createFilter(
    defaultValue = false,
    category = "miscellaneous",
    id = "filterUnidentified",
    displayName = "Identified characters",
    pattern = "string:filterUnidentified",
    description = "Include individuals which are tagged as unidentified."
)
createFilter(
    defaultValue = false,
    category = "miscellaneous",
    id = "filterImage",
    displayName = "Characters with pictures",
    pattern = "string:filterImage",
    description = "Include individuals that do not have an image associated with it."
)

// Status
createFilter(
    defaultValue = false,
    category = "status",
    id = "filterNonCanon",
    displayName = "Non-canon",
    pattern = "category:Non-canon_Legends_articles",
    description = "Include non-canon individuals."
)
createFilter(
    defaultValue = false,
    category = "status",
    id = "filterLegends",
    displayName = "Legends",
    pattern = "category:Legends_articles",
    description = "Include legends individuals."
)
createFilter(
    defaultValue = false,
    category = "status",
    id = "filterCanon",
    displayName = "Canon",
    pattern = "category:Canon_articles",
    description = "Include canon individuals."
)

// Appearance
createFilter(
    defaultValue = false,
    category = "appearance",
    id = "filterCustomAppearance",
    displayName = "Custom",
    pattern = "string:",
    description = "Enter name of media as it appears in the Appearances section of articles on Wookieepedia"
)
createFilter(
    defaultValue = false,
    category = "appearance",
    id = "filterAhsoka",
    displayName = "Ahsoka",
    pattern = "appearance:Ahsoka",
    description = "Include individuals who appeared in Ahsoka."
)
createFilter(
    defaultValue = false,
    category = "appearance",
    id = "filterAndor",
    displayName = "Andor",
    pattern = "appearance:Andor",
    description = "Include individuals who appeared in Andor."
)
createFilter(
    defaultValue = false,
    category = "appearance",
    id = "filterObiWan",
    displayName = "Obi-Wan Kenobi",
    pattern = "appearance:Kenobi",
    description = "Include individuals who appeared in Obi-Wan Kenobi."
)
createFilter(
    defaultValue = false,
    category = "appearance",
    id = "filterMandoBoba",
    displayName = "The Mandalorian & The Book of Boba Fett",
    pattern = "appearance:TheMandalorian,BOBF",
    description = "Include individuals who appeared in The Mandalorian & The Book of Boba Fett."
)
createFilter(
    defaultValue = false,
    category = "appearance",
    id = "filterBadBatch",
    displayName = "The Bad Batch",
    pattern = "appearance:TBB",
    description = "Include individuals who appeared in The Bad Batch."
)
createFilter(
    defaultValue = false,
    category = "appearance",
    id = "filterRebels",
    displayName = "Rebels",
    pattern = "appearance:Rebels",
    description = "Include individuals who appeared in Rebels."
)
createFilter(
    defaultValue = false,
    category = "appearance",
    id = "filterCloneWars",
    displayName = "The Clone Wars",
    pattern = "appearance:TCW",
    description = "Include individuals who appeared in The Clone Wars."
)
createFilter(
    defaultValue = false,
    category = "appearance",
    id = "filterSkywalkerRogue",
    displayName = "Skywalker saga & Rogue One",
    pattern = "appearance:",
    description = "Include individuals who appear in movies 1 - 9 & Rogue One"
)