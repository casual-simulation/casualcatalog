if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

if (!thisBot.vars.three) {
    configBot.tags.menuPortal = "simFilterLoading";
    const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
        label: "preparing",
        simFilterLoading: true
    });
    await thisBot.loadImports();

    destroy(loadingBar);
}

shout('abMenuRefresh');
shout("clearSimFilterMenu");

configBot.tags.menuPortal = 'simFilter_menu';

const menuOptions = {
    simFilter_menu: true,
    clearSimFilterMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    filter: getLink(thisBot)
}

const filterTypeButton = {
    ...menuOptions,
    label: 'filter type: ' + tags.filterType ?? '',
    dropdownSortOrder: -1,
    simFilter_menuSortOrder: -1
}

filterTypeButton.dropdownOptions = [];
const filterOptions = [{label: 'dots', id: 'dots'}, {label: 'pixels', id: 'pixels'}, {label: 'bloom', id: 'bloom'}, {label: 'vintage', id: 'vintage'}];
for (let i = 0; i < filterOptions.length; ++i) {
    const tempDropdownItem = {
        ...menuOptions,
        label: filterOptions[i].label,
        filterTypeID: filterOptions[i].id,
        onClick: `@
            links.filter.tags.filterType = tags.filterTypeID;
            links.filter.tags.label = tags.label + " filter";
            links.filter.onClick();
        `
    }
    filterTypeButton.dropdownOptions.push(tempDropdownItem);
}

const activateButton = {
    ...menuOptions,
    label: tags.activeFilter ? "deactivate" : "activate",
    simFilter_menuSortOrder: 2,
    onClick: `@
        if (links.filter.tags.activeFilter == true) {
            links.filter.closeFilterApp();
        } else {
            links.filter.activateFilter();
        }
        
        shout("clearSimFilterMenu");
    `
}

ab.links.menu.abCreateMenuDropdown(filterTypeButton);
ab.links.menu.abCreateMenuButton(activateButton);