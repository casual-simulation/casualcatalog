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
    {
        key: 'startingPage',
        label: 'starting page',
        type: 'text',
        description: 'The pageID for the page that is first',
        default: "",
        value: tags.startingPage,
    }
]

return properties;