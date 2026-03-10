import { JSONAccountBalance } from 'casualos';

if (masks.initialized) {
    return;
}

masks.initialized = true;

if (configBot.tags.abDisableXPE) {
    return;
}

globalThis.abXPE = thisBot;

if (tags.mock) {
    const initialMockBalance: JSONAccountBalance = {
        accountId: authBot.id,
        credits: tags.mockStartCredits,
        currency: 'USD',
        debits: '0',
        displayFactor: '1',
        pendingCredits: '0',
        pendingDebits: '0',
    }

    thisBot.vars.mockBalance = initialMockBalance;

    shout('onABXPEInitialized');
} else {
    // TODO?
    
    shout('onABXPEInitialized');
}
