const properties: ABConfiguratorProperty[] = [
     {
        key: 'name',
        type: 'text',
        label: 'uuab name',
        description: 'The unique name for the uuab',
        default: null,
        value: tags.chosenUUABName,
    },
    {
        key: 'bios',
        type: 'select',
        label: 'bios',
        description: 'The way the inst functions with permissions and user interactions',
        default: "free",
        value: tags.chosenBIOS,
        options: [{value: 'free', label: 'free'}, {value: 'studio', label: 'studio'}, {value: 'local', label: 'local'}]
    },
    {
        key: 'optionalSettings',
        type: 'group',
        label: 'optional settings',
        properties: [
            {
                key: 'pattern',
                type: 'text',
                label: 'pattern',
                description: 'An optional pattern to be loaded into the inst',
                default: "",
                value: tags.chosenPattern,
            },
            {
                key: 'studio',
                type: 'text',
                label: 'pattern studio',
                description: 'The studio associated with the loaded pattern',
                default: configBot.tags.studio ?? tags.studioId ?? authBot.id ?? "",
                value: tags.chosenPatternStudio,
            },
            {
                key: 'inst',
                type: 'text',
                label: 'inst name',
                description: 'An optional inst name if you want users to go to the same inst',
                default: "",
                value: tags.chosenInstName,
            }
        ],
    }
    
]

return properties;