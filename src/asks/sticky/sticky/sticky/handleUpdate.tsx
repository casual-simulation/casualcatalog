// Initialize updatesNeeded array if it doesn't exist
const stickyApp = getBot("system", "stickies.app")
if (!Array.isArray(stickyApp.tags.updatesNeeded)) { stickyApp.tags.updatesNeeded = [] }
// Add this bot to the updatesNeeded array
stickyApp.tags.updatesNeeded.push(thisBot.id);

if (configBot.id !== stickyApp.tags.playerList[0]) {
    console.log("[stickies] Avoiding update")
    os.sleep(5000).then(async () => {
        console.log("[stickies] checking that update happened")
        if (getBot("system", "stickies.app").tags.updatesNeeded.includes(thisBot.id)) {
            console.log("[stickies] update was lost, updating list of players")
            // Reset the list of remotes
            await whisper(stickyApp, "onInit");
            // Re-try the update
            whisper(thisBot, "handleUpdate");
            return;
        }
        console.log("[stickies] update was successful")
    })
    return
}

console.log("[stickies] claiming update")
stickyApp.tags.updatesNeeded = stickyApp.tags.updatesNeeded.filter(u => u !== thisBot.id);

// Add address if it doesn't exist yet
const authBot = await os.requestAuthBot();
if (!tags.stickyAddress) tags.stickyAddress = thisBot.id + '-' + new Date().toISOString();

const stickyRecord = tags.stickyRecord;
if (!stickyRecord) {
    os.toast("Error updating sticky note");
    throw new Error("Tried to update a sticky note, but no record is selected");
}

// Grant record permission
if (!Array.isArray(stickyApp.vars.recordPermissions)) {
    stickyApp.vars.recordPermissions = [];
}

if (!stickyApp.vars.recordPermissions.includes(stickyRecord)) {
    if (await os.grantInstAdminPermission(stickyRecord)) {
        stickyApp.vars.recordPermissions.push(stickyRecord)
    }
}

// Trim data
const payload = {...thisBot.tags};
const tagsToDelete = tags.unstoredTags;
for (var t of tagsToDelete) {
    delete payload[t];
}

// Check if changed
const hash = crypto.hash("sha256", "base64", JSON.stringify(payload));
if (hash === tags.lastUpdateHash) { return };
tags.lastUpdateHash = hash;

// Record definition
const stickyRecordName = stickyRecord;
let address = tags.stickyAddress
if (!address) {
    address = thisBot.id + '-' + new Date().toISOString();
    tags.stickyAddress = address;
}

// Update in records
const result = await os.recordData(stickyRecord, address, payload);
if (result.success) {
    console.log("[stickies] [stickies] Updated sticky note!")
    return { success: true }
} else if (result.errorCode === "record_not_found") {
    const createResult = await os.getPublicRecordKey(stickyRecord);
    if (createResult.success) {
        whisper(thisBot, 'handleUpdate')
    }
} else if (result.errorCode === "not_authorized") {
    if (await os.grantInstAdminPermission(stickyRecord)) {
        whisper(thisBot, 'handleUpdate');
    }
} else {
    os.toast("Failed to update sticky note");
    console.log("[stickies] [stickies] Failed to update sticky note:", result)
    return { success: false }
}
