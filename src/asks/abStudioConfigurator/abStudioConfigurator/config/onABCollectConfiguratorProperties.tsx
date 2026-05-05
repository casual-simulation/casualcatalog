const studioId = tags.studioId;

const studioConfig = await thisBot.getStudioConfig({ studioId });

const properties: ABConfiguratorProperty[] = [
    {
        key: 'studio_credit_icon_url',
        type: 'text',
        label: 'studio credit icon url',
        description: 'Icon URL to use for credits from the studio.',
        value: studioConfig['studio_credit_icon_url'],
    },
    {
        key: 'studio_credit_background_color',
        type: 'color',
        label: 'studio credit background color',
        description: 'Color to use the for the background of the studio\'s credits display.',
        value: studioConfig['studio_credit_background_color'],
    },
    {
        key: 'studio_bootstrap_egg_name',
        type: 'text',
        label: 'studio bootstrap egg name',
        description: 'Egg to load into every new inst that is owned by the studio.',
        value: studioConfig['studio_bootstrap_egg_name']
    },
    {
        key: 'studio_catalog_mesh',
        type: 'group',
        label: 'studio catalog mesh',
        description: 'Appearance settings for the studio\'s catalog bot.',
        properties: [
            {
                key: 'studio_catalog_mesh_url',
                type: 'text',
                label: 'studio catalog mesh url',
                description: 'Mesh URL to use for the studio\'s catalog bot.',
                value: studioConfig['studio_catalog_mesh_url']
            },
            {
                key: 'studio_catalog_scale',
                type: 'number',
                label: 'studio catalog scale',
                description: 'Uniform scale to apply to the studio\'s catalog mesh.',
                value: studioConfig['studio_catalog_scale']
            },
            {
                key: 'studio_catalog_color',
                type: 'color',
                label: 'studio catalog color',
                description: 'Color to apply to the studio\'s catalog mesh.',
                value: studioConfig['studio_catalog_color']
            }
        ]
    }
]

return properties;