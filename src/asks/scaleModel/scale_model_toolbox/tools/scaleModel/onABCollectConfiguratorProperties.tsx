const properties: ABConfiguratorProperty[] = [
    {
        key: 'scaleModelName',
        type: 'text',
        label: 'name',
        description: 'The name of the model, this must be unique',
        default: "",
        value: tags.modelName,
    },
    {
        key: 'scaleModelStats',
        type: 'list',
        label: 'stats',
        description: 'the stats associated with this scale model.',
        default: [],
        value: tags.modelAttributes,
        itemSchema: {
            key: 'stat',
            type: 'group',
            properties: [
                { key: 'name', type: 'text', default: 'unnamed', label: 'Name' },
                { key: 'start', type: 'number', default: 0, label: 'Initial Value' },
            ],
        },
    },
    {
        key: 'scaleModelStates',
        type: 'list',
        label: 'states',
        description: 'the states associated with this scale model.',
        default: [],
        value: tags.modelStates,
        itemSchema: {
            key: 'state',
            type: 'group',
            properties: [
                { key: 'name', type: 'text', default: 'unnamed', label: 'name' },
                { key: 'start', type: 'text', default: '', label: 'initial value' },
            ],
        },
    },
    {
        key: 'scaleModelListeners',
        type: 'list',
        label: 'listeners',
        description: 'the listeners associated with this scale model.',
        default: [],
        value: tags.modelListeners,
        itemSchema: {
            key: 'state',
            type: 'group',
            properties: [
                { key: 'type', type: 'select', default: 'custom', options: [{value: 'stat', label: 'stat'}, {value: 'state', label: 'state'}, {value: 'custom', label: 'custom'}]},
                { key: 'stat', type: 'text', default: null, label: 'stat' },
                { key: 'state', type: 'text', default: null, label: 'state' },
                { key: 'value', type: 'text', default: null, label: 'state trigger value' },
                { key: 'code', type: 'text', default: `@`, label: 'code' },
            ],
        },
    },
]

return properties;