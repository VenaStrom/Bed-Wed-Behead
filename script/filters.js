

// Gender
createFilter(
    defaultValue = true,
    category = "gender",
    id = "filterGenderless",
    displayName = "Neither of the above",
    pattern = "cat:Articles_with_unpopulated_pronoun_parameters",
    description = "Include everything that is not tagged as a man or woman."
)
createFilter(
    defaultValue = true,
    category = "gender",
    id = "filterMale",
    displayName = "Males",
    pattern = "cat:Males",
    description = "Include men"
)
createFilter(
    defaultValue = true,
    category = "gender",
    id = "filterFemale",
    displayName = "Female",
    pattern = "cat:Females||Individuals_with_she/her_pronouns",
    description = "Include women"
)

// Miscellaneous
createFilter(
    defaultValue = false,
    category = "miscellaneous",
    id = "filterCustomMisc",
    displayName = "Custom",
    pattern = "",
    description = "Exclude individuals with names that include this text."
)
createFilter(
    defaultValue = true,
    category = "miscellaneous",
    id = "filterUnidentified",
    displayName = "Unidentified",
    pattern = "filterUnidentified",
    description = "Include individuals which are tagged as unidentified."
)
createFilter(
    defaultValue = true,
    category = "miscellaneous",
    id = "filterImage",
    displayName = "Imageless",
    pattern = "filterImage",
    description = "Include individuals that do not have an image associated with it."
)

// Status
createFilter(
    defaultValue = true,
    category = "status",
    id = "filterNonCanon",
    displayName = "Non-canon",
    pattern = "cat:Non-canon_Legends_articles",
    description = "Include non-canon individuals."
)
createFilter(
    defaultValue = true,
    category = "status",
    id = "filterLegends",
    displayName = "Legends",
    pattern = "cat:Legends_articles",
    description = "Include legends individuals."
)
createFilter(
    defaultValue = true,
    category = "status",
    id = "filterCanon",
    displayName = "Canon",
    pattern = "cat:Canon_articles",
    description = "Include canon individuals."
)

// Appearance
createFilter(
    defaultValue = false,
    category = "appearance",
    id = "filterCustomAppearance",
    displayName = "Custom",
    pattern = "",
    description = "Enter name of media as it appears in the Appearances section of articles on Wookieepedia"
)
createFilter(
    defaultValue = true,
    category = "appearance",
    id = "filterAhsoka",
    displayName = "Ahsoka",
    pattern = "",
    description = "Include individuals who appeared in Ahsoka."
)
createFilter(
    defaultValue = true,
    category = "appearance",
    id = "filterAndor",
    displayName = "Andor",
    pattern = "",
    description = "Include individuals who appeared in Andor."
)
createFilter(
    defaultValue = true,
    category = "appearance",
    id = "filterObiWan",
    displayName = "Obi-Wan Kenobi",
    pattern = "",
    description = "Include individuals who appeared in Obi-Wan Kenobi."
)
createFilter(
    defaultValue = true,
    category = "appearance",
    id = "filterMandoBoba",
    displayName = "The Mandalorian & The Book of Boba Fett",
    pattern = "",
    description = "Include individuals who appeared in The Mandalorian & The Book of Boba Fett."
)
createFilter(
    defaultValue = true,
    category = "appearance",
    id = "filterBadBatch",
    displayName = "The Bad Batch",
    pattern = "",
    description = "Include individuals who appeared in The Bad Batch."
)
createFilter(
    defaultValue = true,
    category = "appearance",
    id = "filterRebels",
    displayName = "Rebels",
    pattern = "",
    description = "Include individuals who appeared in Rebels."
)
createFilter(
    defaultValue = true,
    category = "appearance",
    id = "filterCloneWars",
    displayName = "The Clone Wars",
    pattern = "",
    description = "Include individuals who appeared in The Clone Wars."
)
createFilter(
    defaultValue = true,
    category = "appearance",
    id = "filterSkywalkerRogue",
    displayName = "Skywalker saga & Rogue One",
    pattern = "",
    description = "Include individuals who appear in movies 1 - 9 & Rogue One"
)