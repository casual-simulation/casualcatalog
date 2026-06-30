const properties: ABConfiguratorProperty[] = [
    {
        key: 'simID',
        type: 'text',
        label: 'simID',
        description: 'The id associated with this gate',
        default: uuid(),
        value: tags.simID,
    },
    {
        key: 'triggers',
        type: 'list',
        label: 'triggers',
        description: 'A list of simIDs of other actions/reactions/gates that trigger this action to appear if all of them are completed',
        default: [],
        value: tags.actionTriggers,
        itemSchema: {
            key: 'state',
            type: 'text',
            default: null, 
            label: 'simID',
        },
    }
]

return properties;