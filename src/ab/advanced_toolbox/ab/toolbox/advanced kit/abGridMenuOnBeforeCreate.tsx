const dropdownOptions = await links.menu.abCreateToolboxDropdownOptions({toolboxName: tags.system.substring(11), toolArray: tags.tool_array, toolbox: thisBot, gridInformation: that?.gridInformation});
setTagMask(thisBot, "dropdownOptions", dropdownOptions);

return;