const menuPortal = that.base.tags.abEquipmentMenuPortal ?? configBot.tags.menuPortal ?? 'abMenu';
await os.sleep(0);

const menuOptions = {
    [menuPortal]: true,
    abMenuRefresh: `@
    destroy(thisBot);`,
    baseLink: getLink(that.base)
}

for (let option of that.options) {
    option = {
        ...option,
        ...menuOptions
    }
}

const equipmentDropdown = {
    label: 'equipment',
    [menuPortal + 'SortOrder']: that.base.tags.abEquipmentMenuOrder ?? 200,
    dropdownSortOrder: that.base.tags.abEquipmentMenuOrder ?? 200,
    ...menuOptions,
    dropdownOptions: that.options
}

if (that.options.length > 0) {
  ab.links.menu.abCreateMenuDropdown(equipmentDropdown);  
}