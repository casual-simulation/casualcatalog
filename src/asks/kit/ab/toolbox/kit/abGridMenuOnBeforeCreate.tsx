await os.sleep(0);

if (ab.links.manifestation.tags.currentKit && ab.links.manifestation.tags.currentKit != tags.kitId) {
    masks.abGridMenuHide = true;
} else {
    masks.abGridMenuHide = null;
}

const physKits = getBots("kitId", tags.kitId);
if (physKits.length > 1) {
    let primaryKit;
    for (let i = 0; i < physKits.length; ++i) {
        if (primaryKit) {
           if (physKits[i].id > primaryKit) {
            primaryKit = physKits[i]?.id;
           }
        } else {
            primaryKit = physKits[i]?.id;
        }
    }

    if (thisBot.id != primaryKit) {
        masks.abGridMenuHide = true;
    } else if (masks.abGridMenuHide) {
        masks.abGridMenuHide = true;
    } else {
        masks.abGridMenuHide = null;
    }
}

const gridInformation = abRemember.tags.abGridFocus;

tags.abGridMenuLabel = tags.label;

const dropdownOps = await ab.links.menu.abCreateToolboxDropdownOptions({ menuPortal: 'kitMenu', toolboxName: tags.system.substring(11), toolArray: tags.tool_array, toolbox: thisBot, gridInformation: gridInformation });
masks.dropdownOptions = dropdownOps;