//adding custom menu, with additional tags
let additionalTags = that;
let menuButton = {
    space: "tempLocal",
    psSkypainterId: tags.id,
    color: tags.basePromptButtonColor,
    bbSkyboxMenu: true,
    pointable: false,
    loadMenuReset: "@ destroy(thisBot)",
    draggable: false,
    bbSkyboxMenuBot: true,
}

for (const tag in additionalTags) {
    menuButton[tag] = additionalTags[tag];
}

if (!ab.links.menu) {
    // Load abInterface skill if ab.links.menu is not available.
    await ab.abAdapt('abInterface');
}

// Call abCreateMenuButton to make the menu button bot.
ab.links.menu.abCreateMenuButton(menuButton);