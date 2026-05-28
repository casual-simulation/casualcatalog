const properties: ABConfiguratorProperty[] = [
    {
        key: 'prompt',
        type: 'text',
        description: 'The prompt for the powerup to use to create the scale model',
        default: "",
        value: tags.wizardPrompt,
    },
]

return properties;