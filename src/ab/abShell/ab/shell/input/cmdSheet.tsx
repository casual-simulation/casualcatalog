const args = that;

let portal;
let newTab = false;

if (args) {
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('-')) {
            if (arg === '-t') {
                newTab = true;
            }
        } else if (!portal) {
            portal = arg;
        }
    }
}

if (!portal) {
    portal = os.getCurrentDimension();
}

const helperBots = {
    'configBot': configBot,
    'gridPortalBot': gridPortalBot,
    'sheetPortalBot': sheetPortalBot,
    'systemPortalBot': systemPortalBot,
    'miniGridPortalBot': miniGridPortalBot,
    'mapPortalBot': mapPortalBot,
    'miniMapPortalBot': miniMapPortalBot,
    'menuPortalBot': menuPortalBot,
    'leftWristPortalBot': leftWristPortalBot,
    'rightWristPortalBot': rightWristPortalBot,
    'meetPortalBot': meetPortalBot,
    'tagPortalBot': tagPortalBot,
    'imuPortalBot': imuPortalBot,
};

// Function to resolve a portal reference to a specific bot
function resolvePortalToBot(path) {
    if (!path || path === '') return null;
    
    // First check if it's directly in helperBots
    if (helperBots[path]) {
        return helperBots[path];
    }

    // Perhaps the path is a bot id.
    let botFromIdSearch = getBot('id', path);
    if (botFromIdSearch) {
        return botFromIdSearch;
    }
    
    // Check for both direct and nested paths in globalThis
    let pathParts = path.split('.');
    let currentObj = globalThis;
    let startIndex = 0;
    
    // Handle if the path explicitly starts with 'globalThis'
    if (pathParts[0] === 'globalThis') {
        startIndex = 1; // Skip the 'globalThis' part since we're already starting there
    }
    
    // Traverse the path
    for (let i = startIndex; i < pathParts.length; i++) {
        const part = pathParts[i];
        if (!currentObj[part]) {
            return null; // Path segment doesn't exist
        }
        currentObj = currentObj[part];
    }
    
    // Check if the final object is a bot (has id and tags)
    if (currentObj && currentObj.id && currentObj.tags) {
        return currentObj;
    }
    
    return null; // Not a valid bot
}

// Search to see if portal argument is specific to a bot
let uniqueBot = resolvePortalToBot(portal);

if (uniqueBot) {
    if (uniqueBot.tags.space === 'tempLocal' ||
        uniqueBot.tags.space === 'tempShared'
    ) {
        // Force sheet to open in same tab if the bot only lives in this tab.
        newTab = false;
    }
    portal = uniqueBot.id;
}

if (newTab) {
    os.openURL(`/?inst=${os.getCurrentInst()}&sheetPortal=${portal}`);
} else {
    configBot.tags.sheetPortal = portal;
}