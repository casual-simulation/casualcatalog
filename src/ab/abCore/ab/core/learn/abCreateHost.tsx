const siteOrigin = new URL(configBot.tags.url).origin;

//this function handles creating a file for join codes
if (links.remember.tags.hostID) {
    const joinURL = siteOrigin + "/?joinCode=" + links.remember.tags.hostID;
    os.setClipboard(joinURL);
    os.showQRCode(joinURL);
    ab.links.utils.abToast(`url copied to clipboard`);
    return;
}

if (!authBot) {
    await os.requestAuthBot();
}

if (!authBot) {
    ab.links.utils.abLogAndToast(`please log in to generate a join code`);
    return;
}

function generateJoinCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return code;
}

const newJoinCode = generateJoinCode();
const date = os.isCollaborative() ? os.agreedUponTime : os.localTime;
const recordKey = links.remember.tags.abRecordKey;

// [Ryan Cook]: This is a naive room code generator. It does not check if the room code is already taken / active.
const recordData = await os.recordData(recordKey, `abJoinCode_${newJoinCode}`, { url: configBot.tags.url, date }, { markers: ["publicRead"] });

if (recordData.success) {
    setTagMask(links.remember, 'hostID', newJoinCode, 'shared');

    const joinURL = siteOrigin + "/?joinCode=" + links.remember.tags.hostID;

    os.setClipboard(joinURL);

    if (that && that.tags) {
        that.tags.label = "join code: " + newJoinCode;
    
    }
    os.showQRCode(joinURL);

    ab.links.utils.abLogAndToast(`join code generated: ${newJoinCode}. url copied to clipboard.`);
}
else {
    ab.links.utils.abLogAndToast(`failed to generate join code, please try again.`);
    shout("abMenuRefresh");
}