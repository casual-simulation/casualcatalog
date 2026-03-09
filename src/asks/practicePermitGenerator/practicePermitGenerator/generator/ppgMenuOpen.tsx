thisBot.ppgMenuReset();

masks.menuOpen = true;
configBot.tags.menuPortal = 'ppgMenu';

ab.links.menu.abCreateMenuButton({
    ppgMenu: true,
    label: 'generate csv',
    formAddress: 'view_list',
    manager: getLink(thisBot),
    onClick: `@
        links.manager.ppgCSV();
    `
});

ab.links.menu.abCreateMenuButton({
    ppgMenu: true,
    label: 'generate test qr code',
    formAddress: 'qr_code',
    manager: getLink(thisBot),
    onClick: `@
        links.manager.ppgQR();
    `
});