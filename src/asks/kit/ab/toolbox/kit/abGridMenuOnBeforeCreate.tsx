await os.sleep(0);

if (ab.links.manifestation.tags.currentKit != tags.kitId) {
    masks.abGridMenuHide = true;
} else {
    masks.abGridMenuHide = null;
}

await os.sleep(0);

const gridInformation = abRemember.tags.abGridFocus;

tags.abGridMenuLabel = tags.label;

const dropdownOps = await ab.links.menu.abCreateToolboxDropdownOptions({ menuPortal: 'kitMenu', toolboxName: tags.system.substring(11), toolArray: tags.tool_array, toolbox: thisBot, gridInformation: gridInformation });
masks.dropdownOptions = dropdownOps;