const properties: ABConfiguratorProperty[] = [
    {
        key: 'prompt',
        type: 'text',
        description: 'The prompt for the wizard to use to create the scale model',
        default: "",
        value: tags.userPrompt,
    },
]

return properties;