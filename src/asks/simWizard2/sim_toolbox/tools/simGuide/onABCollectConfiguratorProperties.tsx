const properties: ABConfiguratorProperty[] = [
    {
        key: 'simID',
        label: 'simID',
        type: 'text',
        description: 'The id of the sim for use in egg creation',
        default: "",
        value: tags.simID,
    },
    {
        key: 'prompt',
        type: 'text',
        description: 'The prompt for the guide to use to create the simulation',
        default: "",
        value: tags.wizardPrompt,
    },
]

return properties;