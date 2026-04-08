shout('clearInstCreatorMenu');

configBot.tags.menuPortal = 'instCreatorMenu';

const menuOptions = {
    clearInstCreatorMenu: `@destroy(thisBot);`,
    instCreatorMenu: true,
    abMenuRefresh: `@destroy(thisBot);`,
    wizard: getLink(thisBot)
}

const menuGroup = {
    ...menuOptions,
    groupSortOrder: 1,
    instCreatorMenuSortOrder: 1,
    menuItems: [
        {
            label: "label: " + (tags.chosenLabel || ''),
            formAddress: 'edit',
            onClick: `@
                const chosenLabel = await os.showInput(links.wizard.tags.chosenLabel || "", {
                    title: 'label your server'
                });

                setTagMask(links.wizard, "chosenLabel", chosenLabel, "shared");
                await os.sleep(0);
                links.wizard.showInstCreatorMenu();
            `
        },
        {
            label: "pattern: " + (tags.chosenPattern || ''),
            formAddress: 'edit',
            onClick: `@
                const patternName = await os.showInput(links.wizard.tags.chosenPattern || "", {
                    title: 'choose a pattern to include'
                });

                setTagMask(links.wizard, "chosenPattern", patternName, "shared");
                await os.sleep(0);
                links.wizard.showInstCreatorMenu();
            `
        },
        {
            label: "studio: " + (tags.chosenStudio || ''),
            formAddress: 'edit',
            onClick: `@
                const studioName = await os.showInput(links.wizard.tags.chosenStudio || "", {
                    title: 'select a studio'
                });

                setTagMask(links.wizard, "chosenStudio", studioName, "shared");
                await os.sleep(0);
                links.wizard.showInstCreatorMenu();
            `
        },
        {
            label: "inst name: " + (tags.chosenInstName || ''),
            formAddress: 'edit',
            onClick: `@
                const instName = await os.showInput(links.wizard.tags.chosenInstName || "", {
                    title: 'choose an inst name'
                });

                setTagMask(links.wizard, "chosenInstName", instName, "shared");
                await os.sleep(0);
                links.wizard.showInstCreatorMenu();
            `
        },
        {
            label: "inst type: " + (tags.chosenBIOS || ''),
            menuItemType: 'dropdown',
            instCreatorMenuSortOrder: 2,
            dropdownSortOrder: 2,
            dropdownOptions: [
                {
                    ...menuOptions,
                    label: "free",
                    onClick: `@
                        setTagMask(links.wizard, "chosenBIOS", "free", "shared");
                        links.wizard.showInstCreatorMenu();
                    `
                },
                {
                    ...menuOptions,
                    label: "studio",
                    onClick: `@
                        setTagMask(links.wizard, "chosenBIOS", "studio", "shared");
                        links.wizard.showInstCreatorMenu();
                    `
                },
                {
                    ...menuOptions,
                    label: "local",
                    onClick: `@
                        setTagMask(links.wizard, "chosenBIOS", "local", "shared");
                        links.wizard.showInstCreatorMenu();
                    `
                }
            ]
        },
    ]
}

ab.links.menu.abCreateMenuGroup(menuGroup);

const createButton = {
        clearInstCreatorMenu: `@destroy(thisBot);`,
        abMenuRefresh: `@destroy(thisBot);`,
        instCreatorMenu: true,
        label: "create server",
        wizard: getLink(thisBot),
        formAddress: 'https://auth-aux-prod-filesbucket-682397690660.s3.amazonaws.com/64beb439-12b9-4155-b388-db03b7ec1c9c/b420a437d46113ec17929f3577909c88366f2d568f7734ea43f573fb53e2d1e8.png',
        onClick: `@
            links.wizard.createNewInst();
        `,
        instCreatorMenuSortOrder: 10
    }

ab.links.menu.abCreateMenuButton(createButton);