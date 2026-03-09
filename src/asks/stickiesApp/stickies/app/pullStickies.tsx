const {recordName, address} = that;
if (!recordName) { throw new Error("Did not specify a record when pulling stickies") }
os.toast(`Pulling stickies for record ${recordName}`)

const stickyApp = getBot("system", "stickies.app")
if (!Array.isArray(stickyApp.vars.recordPermissions)) {
    stickyApp.vars.recordPermissions = [];
}

tags.pullingStickies = true;
setTimeout(() => {
    tags.pullingStickies = null;
}, 15000)

if (!stickyApp.vars.recordPermissions.includes(recordName)) {
    if (await os.grantInstAdminPermission(recordName)) {
        stickyApp.vars.recordPermissions.push(recordName)
    }
}

let lastAddress;
if (address) {
    lastAddress = address;
}
let stickyNotes = [];

while (true) {
    const result = await os.listData(recordName, lastAddress);
    if (result.success) {
        console.log("[stickies] Found stickyNotes", result.items);
        if (result.items.length) {
            stickyNotes.push(...result.items);
            lastAddress = result.items[result.items.length - 1].address;
            
        } else {
            break;
        }
    } else {
        os.toast("Failed to get sticky notes");
        console.log("[stickies] Failed to get sticky notes:", result.errorMessage);
        break;
    }
}

console.log("[stickies] Found sticky notes:", stickyNotes)

shout("interruptSync");

const stickyBots = getBots(b => {
    return b.tags.sticky &&
           !b.tags.abTool
});

setTag(stickyBots, 'avoidDelete', true);
destroy(stickyBots, true);

for (var sticky of stickyNotes) {
    var botData = {
        stickyAddress: sticky.address,
        stickyRecord: recordName,
        ...sticky.data,
        ...tags.stickyTags,
        sticky: true,
    }
    delete botData['avoidDelete']
    create(botData)
}

tags.pullingStickies = null;
shout("hideNoteEditor");