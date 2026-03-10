if (!tags.channelID) {
    os.toast("User must provide channel ID");
    return;
}

const channelID = '@' + tags.channelID;
let patternSetting = tags.patternSetting;
let studioSetting = tags.studioSetting;

if (!patternSetting && !studioSetting) {
    patternSetting = "casualTutorial";
    studioSetting = "AB";
} else if (patternSetting && !studioSetting) {
    studioSetting == authBot.id;
} else if (!patternSetting && studioSetting) {
    os.toast("user must provide pattern");
    return;
}

const biosSettings = tags.biosSetting ?? "free";
const sideloadSetting = tags.sideloadSetting ?? false;
const instSetting = tags.instSetting ?? null;

links.channelLoader.createChannel({
        'channelID': channelID,
        'patternSetting': patternSetting,
        'studioSetting': studioSetting,
        'biosSettings': biosSettings,
        'sideloadSetting': sideloadSetting,
        'instSetting': instSetting
    })