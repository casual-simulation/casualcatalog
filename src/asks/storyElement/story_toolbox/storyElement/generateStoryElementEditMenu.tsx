shout("clearStoryElementMenu");

shout("abMenuRefresh");
configBot.tags.menuPortal = "storyElementEditMenu";

if (tags.storyElementLocked) {
    const titleButton = {
        label: thisBot.tags.label,
        clearStoryElementMenu: `@destroy(this);`,
        color: abPersonality.tags.abBaseMenuColor,
        storyElementEditMenu: true
    } 

    const lockButton = {
        label: "locked",
        element: getLink(thisBot),
        formAddress: "lock",
        onClick: `@
            links.element.tags.storyElementLocked = false;
            links.element.generateStoryElementEditMenu();
        `,
        clearStoryElementMenu: `@destroy(this);`,
        storyElementEditMenu: true
    } 

    await ab.links.menu.abCreateMenuText(titleButton);
    await ab.links.menu.abCreateMenuButton(lockButton);
} else {
    const titleEditButton = {
        label: "edit title",
        element: getLink(thisBot),
        onClick: `@
            const newTitle = await os.showInput(links.element.tags.label, {
                title: "Edit title"
            });

            links.element.tags.label = newTitle;
            links.element.generateStoryElementEditMenu();
        `,
        clearStoryElementMenu: `@destroy(this);`,
        storyElementEditMenu: true
    } 

    const promptEditButton = {
        label: "edit prompt",
        element: getLink(thisBot),
        onClick: `@
            const newPrompt = await os.showInput(links.element.tags.elementPrompt, {
                title: "Edit prompt"
            });

            links.element.tags.elementPrompt = newPrompt;
            links.element.generateStoryElementEditMenu();
        `,
        clearStoryElementMenu: `@destroy(this);`,
        storyElementEditMenu: true
    } 

    const quipEditButton = {
        label: "edit quip",
        element: getLink(thisBot),
        onClick: `@
            const newQuip = await os.showInput(links.element.tags.elementQuip, {
                title: "Edit quip"
            });

            links.element.tags.elementQuip = newQuip;
            links.element.generateStoryElementEditMenu();
        `,
        clearStoryElementMenu: `@destroy(this);`,
        storyElementEditMenu: true
    } 

    const lockButton = {
        label: "unlocked",
        element: getLink(thisBot),
        formAddress: "lock",
        onClick: `@
            links.element.tags.storyElementLocked = true;
            links.element.generateStoryElementEditMenu();
        `,
        clearStoryElementMenu: `@destroy(this);`,
        storyElementEditMenu: true
    } 

    await ab.links.menu.abCreateMenuButton(titleEditButton);
    await ab.links.menu.abCreateMenuButton(promptEditButton);
    await ab.links.menu.abCreateMenuButton(quipEditButton);
    await ab.links.menu.abCreateMenuButton(lockButton);

}
