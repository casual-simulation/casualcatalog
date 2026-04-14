const properties: ABConfiguratorProperty[] = [
    {
        key: 'prompt',
        type: 'text',
        description: 'The prompt for the wizard to use to create the scale model',
        default: " ",
        value: tags.userPrompt,
    },
    {
        key: 'destroyAfterUse',
        type: 'boolean',
        description: 'whether or not the wizard should destroy itself after it finishes',
        default: false,
        value: tags.destroyAfterUse,
    },
]

return properties;