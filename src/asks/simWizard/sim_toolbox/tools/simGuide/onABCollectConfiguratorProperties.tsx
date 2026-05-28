const properties: ABConfiguratorProperty[] = [
    {
        key: 'prompt',
        type: 'text',
        description: 'The prompt for the guide to use to create the simulation',
        default: "",
        value: tags.wizardPrompt,
    },
]

return properties;