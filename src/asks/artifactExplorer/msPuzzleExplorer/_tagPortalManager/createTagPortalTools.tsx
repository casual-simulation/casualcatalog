shout("tptBotReset");

const baseMods = {
    space: "tempLocal",
    tagPortalTool: true,
    tptBotReset: `@ console.log("destroying toolPortalTool: " + tags.tagToShow); destroy(thisBot);`,
    onClick: `@
        let tagPortalAddress = configBot.tags.tagPortal;
        let parts = tagPortalAddress.split(".");
        let id = parts[0];
        configBot.tags.tagPortal = id + "." + tags.tagToShow;
        configBot.tags.lastTagShown = tags.tagToShow;
        shout("createTagPortalTools", tags.tagToShow);
    `,
    onBotAdded: '@ tags.system = `tagPortalTools.${tags.tagToShow}`'
}

const tagList = {
    "tileProperties": "Tile Properties",
    "color": "Color",
    "form": "Form",
    "formAddress": "Form Address",
    "label": "Label"
}

const tagKeys = Object.keys(tagList);
const tagPosition = tagKeys.findIndex(e => e == that);

let backEntry, forwardEntry;

if (tagPosition == 0) {
    backEntry = tagKeys[tagKeys.length - 1];
    forwardEntry = tagKeys[tagPosition + 1];
}
else if (tagPosition == tagKeys.length - 1) {
    backEntry = tagKeys[tagPosition - 1];
    forwardEntry = tagKeys[0];
}
else {
    backEntry = tagKeys[tagPosition - 1];
    forwardEntry = tagKeys[tagPosition + 1];
}

create(baseMods, {
    tagToShow: backEntry,
    label: "◀ " + tagList[backEntry] + "",
    tagPortalToolSortOrder: 1
})

create(baseMods, {
    label: "┃",
    onClick: "@",
    pointable: false,
    tagPortalToolSortOrder: 2,
})

create(baseMods, {
    tagToShow: forwardEntry,
    label: "" + tagList[forwardEntry] + " ▶",
    tagPortalToolSortOrder: 3
})