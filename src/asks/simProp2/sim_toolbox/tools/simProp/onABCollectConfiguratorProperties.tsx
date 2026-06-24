const properties: ABConfiguratorProperty[] = [
    {
        key: 'simID',
        type: 'text',
        label: 'simID',
        description: 'The id associated with this prop',
        default: uuid(),
        value: tags.simID,
    },
    {
        key: 'label',
        type: 'text',
        label: 'label',
        description: 'The label that will show up for this prop',
        default: "",
        value: tags.label,
    }
]

return properties;