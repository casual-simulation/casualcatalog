const studioDefault = configBot.tags.studio ?? tags.studioId ?? authBot.id ?? ""

const properties: ABConfiguratorProperty[] = [
    {
        key: 'name',
        type: 'text',
        label: 'egg name',
        description: 'The name of the egg, can be a new egg or an existing egg',
        default: null,
        value: tags.chosenEggName
    },
    {
        key: 'studio',
        type: 'text',
        label: 'studio',
        description: 'The studio to save this egg to',
        default: studioDefault == authBot.id ? 'user' : studioDefault,
        value: tags.chosenStudio,
    } 
]

return properties;