if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout("clearSimWizardMenu");

configBot.tags.menuPortal = 'simWizard_menu';

const menuOptions = {
    simWizard_menu: true,
    clearSimWizardMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    wizard: getLink(thisBot)
}

const promptButton = {
    ...menuOptions,
    label: 'submit prompt',
    simWizard_menuSortOrder: 1,
    formAddress: 'edit',
    onSubmit: `@
        masks.menuItemText = null;
        links.wizard.tags.wizardPrompt = that.text;
        links.wizard.generatePrompt(that.text);
    `
}

const detailedPromptButton = {
    ...menuOptions,
    label: 'submit detailed prompt',
    simWizard_menuSortOrder: 2,
    formAddress: 'edit',
    onSubmit: `@
        masks.menuItemText = null;
        links.wizard.tags.wizardPrompt = that.text;
        links.wizard.generateFromPrompt(that.text);
    `
}

const csvButton = {
    ...menuOptions,
    label: 'upload csv',
    formAddress: 'upload',
    simWizard_menuSortOrder: 4,
    onClick: `@
        const files = await os.showUploadFiles(); 
        if (files) {
            links.wizard.generateFromCSV(files[0]);
        } 
        shout("clearSimWizardMenu");
    `
}

const downloadButton = {
    ...menuOptions,
    label: 'download simulation',
    formAddress: 'download',
    simWizard_menuSortOrder: 5,
    onClick: `@
        links.wizard.downloadSim();
        shout("clearSimWizardMenu");
    `
}

const cameraButton = {
    ...menuOptions,
    label: 'use camera to generate sim',
    formAddress: 'photo_camera',
    simWizard_menuSortOrder: 3,
    onClick: `@
        links.wizard.generateFromCamera();
        shout("clearSimWizardMenu");
    `
}

ab.links.menu.abCreateMenuInput(promptButton);
ab.links.menu.abCreateMenuInput(detailedPromptButton);
ab.links.menu.abCreateMenuButton(csvButton);
ab.links.menu.abCreateMenuButton(downloadButton);
ab.links.menu.abCreateMenuButton(cameraButton);
