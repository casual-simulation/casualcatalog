const properties: ABConfiguratorProperty[] = [
    {
        key: 'bios',
        type: 'select',
        label: 'bios',
        description: 'The way the inst functions with permissions and user interactions',
        default: "free",
        value: tags.biosSetting,
        options: [{value: 'free', label: 'free'}, {value: 'studio', label: 'studio'}, {value: 'local', label: 'local'}, {value: 'temp', label: 'temp'}]
    },
    {
        key: 'studio',
        type: 'text',
        label: 'studio',
        description: 'The studio associated with this inst',
        default: configBot.tags.studio ?? tags.studioId ?? authBot.id ?? "",
        value: tags.studioSetting,
    },
    {
        key: 'optionalSettings',
        type: 'group',
        label: 'optional settings',
        properties: [
            {
                key: 'label',
                type: 'text',
                label: 'label',
                description: 'An optional cosmetic label',
                default: "",
                value: tags.labelSetting,
            },
            {
                key: 'pattern',
                type: 'text',
                label: 'pattern',
                description: 'An optional pattern to be loaded into the inst',
                default: "",
                value: tags.patternSetting,
            },
            {
                key: 'version',
                type: 'text',
                label: 'pattern version',
                description: 'An optional version setting for the pattern, if you used one',
                default: "",
                value: tags.versionSetting,
            },
            {
                key: 'inst',
                type: 'text',
                label: 'inst name',
                description: 'An optional inst name if you want users to go to the same inst',
                default: "",
                value: tags.instSetting,
            },
            {
                key: 'channel',
                type: 'text',
                label: 'channel name',
                description: 'An optional channel name if you want users to go to a channel',
                default: "",
                value: tags.channelSetting,
            },
            {
                key: 'abAwake',
                type: 'boolean',
                label: 'ab awake',
                description: 'An optional toggle if you want ab to appear or not',
                default: "",
                value: tags.abAwakeSetting,
            },
            {
                key: 'comId',
                type: 'text',
                label: 'com ID',
                description: 'An optional com ID if you want to specify',
                default: configBot.tags.comId ?? "",
                value: tags.comIdSetting,
            },
            {
                key: 'urlVariables',
                type: 'list',
                label: 'url variables',
                description: 'An optional list of url variables to be included',
                default: [],
                value: tags.urlVariables,
                itemSchema: {
                    key: 'state',
                    type: 'group',
                    properties: [
                        { key: 'variable', type: 'text', default: null, label: 'variable'},
                        { key: 'value', type: 'text', default: null, label: 'value'},
                    ],
                },
            },
        ],
    }
    
]

return properties;