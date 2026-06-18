return ( {
    label: "artifact journal",
    formAddress: 'menu_book',
    journal: getLink(thisBot),
    onClick: `@
        links.journal.onClick();
    `
})