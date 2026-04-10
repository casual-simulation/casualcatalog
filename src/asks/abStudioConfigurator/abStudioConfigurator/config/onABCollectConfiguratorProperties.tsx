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
    }
]

return properties;