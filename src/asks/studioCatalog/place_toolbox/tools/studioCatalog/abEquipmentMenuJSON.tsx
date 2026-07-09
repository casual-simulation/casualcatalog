return ( {
    label: tags.label,
    formAddress: 'menu_book',
    catalog: getLink(thisBot),
    onClick: `@
        links.catalog.onClick({forceMenu: true});
        await os.sleep(0);
        ab.links.equipment.onEquipmentBaseSelected(links.catalog);
    `
})