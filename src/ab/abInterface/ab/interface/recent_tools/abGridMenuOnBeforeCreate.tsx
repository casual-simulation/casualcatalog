const tools = tags.tools ?? [];

if (!Array.isArray(tools) || tools.length === 0) {
    setTagMask(thisBot, "abGridMenuHide", true);
    return;
}

setTagMask(thisBot, "abGridMenuHide", null);

const dropdownOptions = await ab.links.menu.abCreateToolboxDropdownOptions({
    toolboxName: "recent tools",
    toolArray: tools,
    gridInformation: that?.gridInformation,
});

setTagMask(thisBot, "dropdownOptions", dropdownOptions);
