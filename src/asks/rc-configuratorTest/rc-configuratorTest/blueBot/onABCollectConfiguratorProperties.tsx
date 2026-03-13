const properties: ABConfiguratorProperty[] = [
    {
        key: 'blueBotVisible',
        type: 'boolean',
        description: 'Wether or not the blue bot is visibile in the home dimension.',
        default: true,
        value: tags.home,
    },
    {
        key: 'blueBotAppearance',
        type: 'group',
        label: 'Blue Bot Appearance',
        description: 'Apperance configuration properties for the blue bot.',
        visibleWhen: {
            key: 'blueBotVisible',
            operator: 'equal',
            value: true
        },
        properties: [
            {
                key: 'blueBotShape',
                type: 'select',
                value: tags.form,
                default: 'cube',
                options: [
                    {
                        value: 'cube',
                        label: 'Cube',
                    },
                    {
                        value: 'sphere',
                        label: 'Sphere',
                    },
                    {
                        value: 'cylinder',
                        label: 'Cylinder',
                    }
                ],
            },
            {
                key: 'blueBotInterests',
                type: 'multiselect',
                value: tags.interests,
                // default: [ 'movies', 'videogames' ],
                // default: [0],
                default: [
                    { label: 'Sports', value: 'sports' },
                    { label: 'Music', value: 'music' }
                ],
                options: [
                    {
                        value: 'sports',
                        label: 'Sports',
                    },
                    {
                        value: 'movies',
                        label: 'Movies',
                    },
                    {
                        value: 'music',
                        label: 'Music',
                    },
                    {
                        value: 'videogames',
                        label: 'Video Games',
                    },
                    {
                        value: 'boardgames',
                        label: 'Board Games',
                    },
                    {
                        value: 'reading',
                        label: 'Reading',
                    }
                ],
            },
            {
                key: 'blueBotHoverColor',
                type: 'color',
                default: 'white',
                description: 'Color of the blue bot when it is being hovered over by a pointer.',
                label: 'Blue bot hover color',
                value: tags.hoverColor,
            }
        ]
    },
]

return properties;