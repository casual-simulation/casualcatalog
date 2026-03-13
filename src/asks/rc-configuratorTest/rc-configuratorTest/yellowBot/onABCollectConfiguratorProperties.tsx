const visibleWhenYellowBotOn: ABConfiguratorVisibility = {
    key: 'yellowBotVisible',
    operator: 'equal',
    value: true,
}

const properties: ABConfiguratorProperty[] = [
    {
        key: 'yellowBotVisible',
        type: 'boolean',
        label: 'Yellow Bot Visible',
        default: true,
        value: tags.home,
        description: 'Wether or not the yellow bot visible in the home dimension.'
    },
    {
        key: 'yellowBotClickMessage',
        type: 'text',
        label: 'Yellow Bot Click Message',
        default: 'Hello, from the Yellow Bot!',
        value: tags.clickMessage,
        placeholder: 'message to toast when clicked',
        description: 'The message to toast when the yellow bot is clicked.',
        visibleWhen: visibleWhenYellowBotOn,
    },
    {
        key: 'yellowBotColorVariant',
        type: 'select',
        default: 'gold',
        value: tags.color,
        options: [
            {
                value: 'gold',
                label: 'Gold',
            },
            {
                value: 'yellow',
                label: 'Yellow',
            },
            {
                value: '#FCC400',
                label: 'Honey'
            },
            {
                value: '#ffff80',
                label: 'Lemonade'
            }
        ],
        description: 'The variant of the color yellow that the yellow bot is.',
        visibleWhen: visibleWhenYellowBotOn,
    },
    {
        key: 'yellowBotX',
        type: 'number',
        default: -3,
        value: tags.homeX,
        // integer: true,
        min: -10,
        max: 16,
        step: 3,
        label: 'Yellow Bot X',
        description: 'The X coordinate of the yellow bot in the home dimension.',
        visibleWhen: visibleWhenYellowBotOn,
    },
    {
        key: 'yellowBotY',
        type: 'number',
        default: -6,
        value: tags.homeY,
        label: 'Yellow Bot Y',
        description: 'The Y coordinate of the yellow bot in the home dimension.',
        visibleWhen: visibleWhenYellowBotOn,
    },
];

return properties;