const humeSocket = thisBot.vars.humeSocket;

if (!humeSocket) {
    return false;
}

const name = abPersonality.tags.abBuilderIdentity;

// abUnsetValue is the sentinel for an intentionally-empty personalization prompt — treat it as none.
const rawPersonalizationPrompt = abPersonality.tags.abPersonalizationPrompt;
const personalization_prompt = (rawPersonalizationPrompt && rawPersonalizationPrompt !== abPersonality.tags.abUnsetValue) ? rawPersonalizationPrompt : 'None specified.';

// abUnsetValue is the sentinel for an intentionally-empty prime directive prompt — treat it as none.
const rawPrimeDirectivePrompt = abPersonality.tags.abPrimeDirectivePrompt;
const prime_directive_prompt = (rawPrimeDirectivePrompt && rawPrimeDirectivePrompt !== abPersonality.tags.abUnsetValue) ? rawPrimeDirectivePrompt : 'None specified.';

const user_focus = ab.links.remember.links.abMultipleBotFocus ??
                   ab.links.remember.links.abBotFocus ??
                   ab.links.remember.links.abGridFocus ?? 
                   ab.links.remember.tags.abGridFocus ?? 
                   null;
                   
const catalog = await ab.links.ask.abAskToolGetCatalog();

const scene_data = getBots(
    byTag(ab.links.remember.tags.abActiveDimension, true),
    bySpace('shared'),
    not(byTag("abIgnore", true)),
    not(byTag("abBot", true))
);

const variables = { name, personalization_prompt, prime_directive_prompt, catalog, user_focus, scene_data };

if (tags.debugMode) {
    console.log(`[${tags.system}.${tagName}] sending session settings:`, variables);
}

humeSocket.send(JSON.stringify({ type: 'session_settings', variables }));

return true;