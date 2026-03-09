const {botId, newRecord, newAddress} = that;
const stickyBot = getBot(byID(botId));

if (!stickyBot) {
    throw new Error("[stickies] Tried to update a sticky note, but could not find the bot with ID:", botId);
}

const oldRecord = stickyBot.tags.stickyRecord;
const oldAddress = stickyBot.tags.stickyAddress;
const address = newAddress;

const stickyApp = getBot("system", "stickies.app")
if (!Array.isArray(stickyApp.vars.recordPermissions)) {
    stickyApp.vars.recordPermissions = [];
}

if (!stickyApp.vars.recordPermissions.includes(oldRecord)) {
    if (await os.grantInstAdminPermission(oldRecord)) {
        stickyApp.vars.recordPermissions.push(oldRecord)
    } else {
        return { success: false }
    }
}

stickyBot.tags.stickyRecord = newRecord;
stickyBot.tags.stickyAddress = newAddress;
const writeResult = await stickyBot.handleUpdate();
console.log("Write result:", writeResult)
if (writeResult?.success) {
    if (oldRecord) {
        await os.eraseData(oldRecord, oldAddress);
    }
} else {
    os.toast("Could not move sticky note")
    return { success: false }
}

return { success: true }