const properties: ABConfiguratorProperty[] = [
    {
        key: 'listBotUrls',
        type: 'list',
        label: 'File URLs',
        description: 'A list of file URLs to load.',
        addLabel: 'Add URL',
        itemSchema: { type: 'text', key: 'value', placeholder: 'https://...' },
        value: tags.fileUrls,
        default: [],
    },
    {
        key: 'listBotColorTimeline',
        type: 'list',
        label: 'Color Timeline',
        description: 'A sequence of color keyframes with timing.',
        addLabel: 'Add Keyframe',
        itemSchema: [
            { type: 'color', key: 'color', label: 'Color', default: '#ffffff' },
            { type: 'number', key: 'time', label: 'Time (s)', min: 0, default: 1 },
        ],
        value: tags.colorTimeline,
        default: [],
    },
];

return properties;
