//adding custom menu, with additional tags
let additionalTags = that;
let menuButton = {
    pointable: false,
    labelAlignment: "center",
    menuSortOrder: -5,
    trackNum: -1,
    loadMenuReset: "@ destroy(thisBot)",
    menuItemStyle: {
        "border-radius": "8px",
        "margin-top": "3px",
        "opacity": 1,
    },
    menuY: 1,
    scaleX: 5,
    scaleZ: 0.61,
    draggable: false
}
for (const tag in additionalTags) 
{
    menuButton[tag] = additionalTags[tag];
}

menuButton = await create(menuButton);