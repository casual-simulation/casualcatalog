shout('clearInstCreatorMenu');

//chosen
let bios = 'studio';
let instName = tags.instSetting ?? null;
let ask = '';
const studio = tags.studioId;

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

if (studio) {
    newURL.searchParams.append("studio", studio);
}

if (abAwake) {
    newURL.searchParams.append("abStayAwake", abAwake);
}

if (bios == 'studio') {
    if (instName) {
        newURL.searchParams.append("owner", studio ?? authBot.id);
        newURL.searchParams.append("inst", instName);
        newURL.searchParams.append("gridPortal", 'home');
    } else {
        newURL.searchParams.append("bios", 'studio');
    }
}

if (!tags.label) {
    if(instName) {
        tags.label = instName;
    }
}

tags.instURL = newURL.href;