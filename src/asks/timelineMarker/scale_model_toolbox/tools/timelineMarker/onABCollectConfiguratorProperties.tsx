const properties: ABConfiguratorProperty[] = [
    {
        key: 'step',
        type: 'number',
        description: 'The value that sets what step of the timeline the scale model is on.',
        default: 0,
        value: tags.timeValue,
    },
    {
        key: 'unit',
        type: 'select',
        description: 'The unit set by the wizard or user, purely visual',
        default: "month",
        value: tags.timeUnit,
        options: [
            {
                value: 'minute',
                label: 'minutes'
            },
            {
                value: 'hour',
                label: 'hours'
            },
            {
                value: 'day',
                label: 'days'
            },
            {
                value: 'week',
                label: 'weeks'
            },
            {
                value: 'month',
                label: 'months'
            },
            {
                value: 'quarter',
                label: 'quarters'
            },
            {
                value: 'year',
                label: 'years'
            },
        ]
    },
]

return properties;