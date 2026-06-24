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
        key: 'story',
        type: 'text',
        label: 'story',
        description: 'The text that will appear in the history log for the user when this reaction is completed',
        default: "",
        value: tags.actionStory,
    },
    {
        key: 'reactionType',
        type: 'select',
        label: 'reaction type',
        description: 'The type of interaction this prop reaction cares about',
        default: "onClick",
        value: tags.propReactionType,
        options: [{value: 'onClick', label: 'onClick'}, {value: 'onDrag', label: 'onDrag'}]
    },
    {
        key: 'props',
        type: 'list',
        label: 'props',
        description: 'A list of simIDs of props that trigger this reaction to complete',
        default: [],
        value: tags.actionTriggers,
        itemSchema: {
            key: 'state',
            type: 'text',
            default: null, 
            label: 'simID',
        },
    },
]

return properties;