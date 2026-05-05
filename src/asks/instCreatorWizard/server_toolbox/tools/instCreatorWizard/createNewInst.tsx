shout('clearInstCreatorMenu');

//chosen
let bios = tags.chosenBIOS;
let instName = tags.chosenInstName;
const pattern = tags.chosenPattern;
const studio = tags.chosenStudio;

//appearance
const label = tags.chosenLabel;
const color = tags.chosenColor;
const form = tags.chosenForm;
const linkTo = tags.linkTo;

//url variables
const abAwake = tags.abAwake;
const comId = tags.comIdSetting ?? configBot.tags.comId;
const urlVariables = tags.urlVariables ?? {};

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

for (const uVar in urlVariables) {
    if (uVar == "version" || uVar == "patternVersion") {
        if (urlVariables[uVar] != "current") {
            newURL.searchParams.append("patternVersion", urlVariables[uVar]);
        }
    } else if (uVar == "channel") {
        if (abRemember.tags.allowChannels) {
            newURL.searchParams.append(uVar, urlVariables[uVar]);
        }
    } else {
        newURL.searchParams.append(uVar, urlVariables[uVar]);
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

const abArtifactShard = {
    data: {
        'biosSetting': bios,
        'instSetting': instName,
        'instURL': newURL.href,
        'patternSetting': pattern,
        'studioSetting': studio,
        'lineTo': linkTo,
        'label': label,
        'color': color,
        'form': form,
        studioId: tags.studioId,
        originType: tags.originType,
        eggParameters: {
            gridInformation: tags.gridInformation
        }
    },
    dependencies: [
        {
            askID: "instBot"
        }
    ]
};

ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: "instBot",
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});

shout("abMenuRefresh");

destroy(thisBot);