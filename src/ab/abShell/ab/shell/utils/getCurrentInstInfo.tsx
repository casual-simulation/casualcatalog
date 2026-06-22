// Derives the current inst's identity from the configBot: its name, type, and owner.
// Returns { inst, instType, instOwner } where instType is one of 'static' | 'temp' | 'private' | 'public'.

const inst = configBot.tags.inst ?? configBot.tags.staticInst ?? configBot.tags.tempInst;
const instOwner = configBot.tags.owner;

let instType;
if (configBot.tags.staticInst) {
    instType = 'static';
} else if (configBot.tags.tempInst) {
    instType = 'temp';
} else if (configBot.tags.owner !== 'public') {
    instType = 'private';
} else {
    instType = 'public';
}

return { inst, instType, instOwner };
