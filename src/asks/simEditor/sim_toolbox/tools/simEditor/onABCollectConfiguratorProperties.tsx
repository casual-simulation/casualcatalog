const properties: ABConfiguratorProperty[] = [
    { key: 'pageID', type: 'text', default: null, label: 'pageID'},
    { key: 'objective', type: 'text', default: null, label: 'objective'},
    { 
        key: 'bots', 
        type: 'list', 
        default: [], 
        label: 'bots',
        value: tags.pageBotData,
        itemSchema: {
            key: 'bot',
            type: 'group',
            properties: [
                {key: 'botDescription', type: 'text', default: null, label: 'description'},
                {key: 'botID', type: 'text', default: null, label: 'botID'}
            ]
        }
    },
    { 
        key: 'steps', 
        type: 'list', 
        default: [], 
        label: 'steps',
        value: tags.pageData,
        itemSchema: {
            key: 'step',
            type: 'group',
            properties: [
                {key: 'stepID', type: 'text', default: null, label: 'description'},
                {key: 'instruction', type: 'text', default: null, label: 'instruction'},
                {key: 'highlight', type: 'text', description: "the botID of the bot that should be highlighted for this step", default: null, label: 'highlight'},
                {key: 'actionType', type: 'select', default: 'click', label: 'actionType', options: [{value: 'click', label: 'click'}, {value: 'drag', label: 'drag'}, {value: 'confirm', label: 'confirm'}]},
                {key: 'clickTarget', type: 'text', description: "the botID of the bot that should be clicked if actionType is click", default: null, label: 'clickTarget'},
                {key: 'dragTarget', type: 'text',  description: "an x,y coordinate that the dragObject should be dragged to if actionType is drag", default: "0,0", label: 'dragTarget'},
                {key: 'dragObject', type: 'text',  description: "the botID of the bot that should be dragged if actionType is drag", default: null, label: 'dragObject'},
                {key: 'dragThreshold', type: 'number',  description: "the distance from the dragTarget that would be a valid success if actionType is drag", default: null, label: 'dragThreshold'}                        
            ]
        }
    },
    { key: 'prevPage', type: 'text', description: "the pageID of the page that should be before this page", default: null, label: 'previous page'},
    { key: 'nextPage', type: 'text', description: "the pageID of the page that should be after this page", default: null, label: 'next page'},
]

return properties;