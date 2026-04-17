const humeSocket = thisBot.vars.humeSocket;

if (!humeSocket) {
    return false;
}

const name = abPersonality.tags.abBuilderIdentity;

const user_focus = ab.links.remember.links.abMultipleBotFocus ??
                   ab.links.remember.links.abBotFocus ??
                   ab.links.remember.links.abGridFocus ?? 
                   ab.links.remember.tags.abGridFocus ?? 
                   null;
                   
const catalog = ab.links.ask.abAskToolGetCatalog();

const scene_data = getBots(
    byTag(ab.links.remember.tags.abActiveDimension, true),
    bySpace('shared'),
    not(byTag("abIgnore", true)),
    not(byTag("abBot", true))
);

const variables = { name, catalog, user_focus, scene_data };

if (tags.debugMode) {
    console.log(`[${tags.system}.${tagName}] sending session settings:`, variables);
}

humeSocket.send(JSON.stringify({ type: 'session_settings', variables }));

return true;