shout('clearInstCreatorMenu');

//chosen
let bios = tags.biosSetting;
let instName = tags.instSetting;
const pattern = tags.patternSetting;
const studio = tags.studioSetting ?? tags.studioId;

//appearance
const label = tags.labelSetting;

//url variables
const abAwake = tags.abAwakeSetting;
const comId = tags.comIdSetting ?? configBot.tags.comId;
const urlVariables = tags.urlVariables ?? [];

const oldURL = new URL(configBot.tags.url);
const sessKey = oldURL.searchParams.get("sessionKey");
const connKey = oldURL.searchParams.get("connectionKey");

if (!bios) {
    bios = 'free';
}

if (!instName) {
    instName = uuid();
}

const currentURL = new URL(configBot.tags.url);
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

if (pattern) {
    newURL.searchParams.append("pattern", pattern);
}

if (studio) {
    newURL.searchParams.append("studio", studio);
}

if (abAwake) {
    newURL.searchParams.append("abStayAwake", abAwake);
}

for (const uVar of urlVariables) {
    if (uVar.variable == "version" || uVar.variable == "patternVersion") {
        if (uVar.value != "current") {
            newURL.searchParams.append("patternVersion", uVar.value);
        }
    } else if (uVar.variable == "channel") {
        if (abRemember.tags.allowChannels) {
            newURL.searchParams.append(uVar.variable, uVar.value);
        }
    } else {
        newURL.searchParams.append(uVar.variable, uVar.value);
    }
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
else if (bios == 'local') {
    if (instName) {
        newURL.searchParams.append("staticInst", instName);
        newURL.searchParams.append("gridPortal", 'home');
    } else {
        newURL.searchParams.append("bios", 'local');
    }
} 
else if (bios == 'free') {
    newURL.searchParams.append("owner", 'public');
    newURL.searchParams.append("inst", instName);
    newURL.searchParams.append("gridPortal", 'home');
}


if (!tags.instURL) {
    if (!tags.creationTime) {
        tags.creationTime = DateTime?.now()?.toMillis();

        if (tags.biosSetting == 'free') {
            tags.expirationTime = DateTime?.fromMillis(tags.creationTime + (24 * 1000 * 60 * 60))?.toMillis();
        }
    }
}

if (!label) {
    let instShortening;
    if(instName) {
        instShortening = instName.slice(-4);
    }
    let newlabel = (instShortening ?? 'inst ') + (tags.biosSetting ? (" (" + tags.biosSetting + ")") : "");
    tags.label = newlabel;
}

tags.instURL = newURL.href;