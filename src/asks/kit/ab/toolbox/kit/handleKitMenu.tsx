shout("clearKitMenu");

const gridInformation = {dimension: that?.dimension, position: { x: that?.x, y: that?.y}} ?? abRemember.tags.abGridFocus;
const toolboxTools = [...tags.tool_array] ?? [];

configBot.tags.menuPortal = 'kitMenu';

const kitDropdown = {
    defaultOpen: true,
    kitMenu: true,
    clearKitMenu: `@destroy(thisBot);`,
    abMenuRefresh: `@destroy(thisBot);`,
    dropdownSortOrder: 1,
    label: tags.label
}

const dropdownOps = await ab.links.menu.abCreateToolboxDropdownOptions({menuPortal: 'kitMenu', toolboxName: tags.system.substring(11), toolArray: tags.tool_array, toolbox: thisBot, gridInformation: gridInformation});
kitDropdown["dropdownOptions"] = dropdownOps;

if (!tags.tool_array || tags.tool_array.length == 0) {
    return;
} else {
  ab.links.menu.abCreateMenuDropdown(kitDropdown);  
}