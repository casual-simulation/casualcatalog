const properties: ABConfiguratorProperty[] = [
    {
        key: 'simID',
        type: 'text',
        label: 'simID',
        description: 'The id associated with this action',
        default: uuid(),
        value: tags.simID,
    },
    {
        key: 'label',
        type: 'text',
        label: 'label',
        description: 'The text label that will show up for this action button',
        default: "",
        value: tags.label,
    },
    {
        key: 'story',
        type: 'text',
        label: 'story',
        description: 'The text that will appear in the history log for the user when this action is completed',
        default: "",
        value: tags.actionStory,
    },
    {
        key: 'triggers',
        type: 'list',
        label: 'triggers',
        description: 'A list of simIDs of other actions/reactions that trigger this action to appear',
        default: [],
        value: tags.actionTriggers,
        itemSchema: {
            key: 'state',
            type: 'text',
            default: null, 
            label: 'simID',
        },
    },
    {
        key: 'startingAction',
        type: 'boolean',
        label: 'starting action',
        description: 'whether or not this action is the first action for a page',
        default: false,
        value: tags.startingAction,
    },
]

return properties;