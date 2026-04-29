const properties: ABConfiguratorProperty[] = [
    {
        key: 'greenBotLists',
        type: 'group',
        label: 'Green Bot Lists',
        description: 'Examples of dynamic list properties (simple and complex).',
        properties: [
            {
                key: 'greenBotFavoriteNumbers',
                type: 'list',
                label: 'Favorite Numbers',
                description: 'A simple list of integers between 0 and 100.',
                default: [1, 2, 3],
                value: tags.favoriteNumbers,
                itemSchema: {
                    key: 'favoriteNumber',
                    type: 'number',
                    min: 0,
                    max: 100,
                    integer: true,
                    default: 0,
                },
            },
            {
                key: 'greenBotNicknames',
                type: 'list',
                label: 'Nicknames',
                description: 'A simple list of text nicknames.',
                default: ['greenie', 'sproutling'],
                value: tags.nicknames,
                itemSchema: {
                    key: 'nickname',
                    type: 'text',
                    default: 'unnamed',
                },
            },
            {
                key: 'greenBotFlags',
                type: 'list',
                label: 'Boolean Flags',
                description: 'A simple list of boolean flags.',
                default: [true, false, true],
                value: tags.flags,
                itemSchema: {
                    key: 'flag',
                    type: 'boolean',
                    default: false,
                },
            },
            {
                key: 'greenBotWaypoints',
                type: 'list',
                label: 'Waypoints',
                description: 'Complex list — text + two numbers.',
                default: [{ name: 'origin', x: 0, y: 0 }],
                value: tags.waypoints,
                itemSchema: {
                    key: 'waypoint',
                    type: 'group',
                    properties: [
                        { key: 'name', type: 'text', default: 'unnamed', label: 'Name' },
                        { key: 'x', type: 'number', default: 0, label: 'X' },
                        { key: 'y', type: 'number', default: 0, label: 'Y' },
                    ],
                },
            },
            {
                key: 'greenBotTodos',
                type: 'list',
                label: 'Todo Items',
                description: 'Complex list — text + boolean + bounded integer priority.',
                default: [
                    { task: 'water the plants', done: false, priority: 1 },
                    { task: 'feed the cat', done: true, priority: 3 },
                ],
                value: tags.todos,
                itemSchema: {
                    key: 'todo',
                    type: 'group',
                    properties: [
                        { key: 'task', type: 'text', default: 'new task', label: 'Task' },
                        { key: 'done', type: 'boolean', default: false, label: 'Done' },
                        { key: 'priority', type: 'number', min: 1, max: 5, integer: true, default: 1, label: 'Priority (1-5)' },
                    ],
                },
            },
            {
                key: 'greenBotContacts',
                type: 'list',
                label: 'Contacts',
                description: 'Complex list — multiple text fields, a number, and a boolean.',
                default: [
                    { name: 'Alice', email: 'alice@example.com', age: 30, vip: true },
                ],
                value: tags.contacts,
                itemSchema: {
                    key: 'contact',
                    type: 'group',
                    properties: [
                        { key: 'name', type: 'text', default: 'unnamed', label: 'Name' },
                        { key: 'email', type: 'text', default: '', label: 'Email' },
                        { key: 'age', type: 'number', min: 0, max: 150, integer: true, default: 0, label: 'Age' },
                        { key: 'vip', type: 'boolean', default: false, label: 'VIP' },
                    ],
                },
            },
        ],
    },
];

return properties;
