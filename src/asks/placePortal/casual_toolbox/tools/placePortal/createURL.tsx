shout('clearInstCreatorMenu');

//chosen
let bios = 'studio';
let instName = tags.instSetting ?? null;
let ask = 'placePortalInitializer';
const studio = tags.studioId;

instName = instName.replace(/[^a-zA-Z0-9]/g, '');
tags.instSetting = instName;

//url variables
const abAwake = true;
const comId = configBot.tags.comId;

const currentURL = new URL(configBot.tags.url);
const sessKey = currentURL.searchParams.get("sessionKey");
const connKey = currentURL.searchParams.get("connectionKey");
const origin = currentURL.origin;

let newURL = new URL(origin);

if (comId) {
    newURL.searchParams.append("comId", comId);
}

if (sessKey) {
    newURL.searchParams.append("sessionKey", sessKey);
}

if (connKey) {
    newURL.searchParams.append("connectionKey", connKey);
}

if (ask) {
    newURL.searchParams.append("ask", ask);
}

const ownerStudio = tags.studioId ?? authBot.id;
if (studio && studio != ownerStudio) {
    newURL.searchParams.append("studio", studio);
}

newURL.searchParams.append("portalColor", tags.color);

if (abAwake) {
    newURL.searchParams.append("abStayAwake", abAwake);
}

if (bios == 'studio') {
    if (instName) {
        newURL.searchParams.append("owner", tags.studioId ?? authBot.id);
        newURL.searchParams.append("inst", instName);
        newURL.searchParams.append("gridPortal", 'home');
    } else {
        newURL.searchParams.append("bios", 'studio');
    }
}

if(instName) {
    tags.label = instName;
    tags.placeLabel = instName;
    tags.homePlace = true;
}

tags.instURL = newURL.href;