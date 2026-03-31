if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout("clearScaleModelWizardMenu");

configBot.tags.menuPortal = 'scaleModelWizard_menu';

const menuOptions = {
    scaleModelWizard_menu: true,
    clearScaleModelWizardMenu: `@destroy(thisBot);`,
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
        links.wizard.generateFromPrompt(that.text);
    `
}

const cameraButton = {
    ...menuOptions,
    label: 'use camera to generate scale model',
    formAddress: 'photo_camera',
    simWizard_menuSortOrder: 3,
    onClick: `@
        links.wizard.generateFromCamera();
        shout("clearScaleModelWizardMenu");
    `
}

ab.links.menu.abCreateMenuInput(promptButton);
ab.links.menu.abCreateMenuButton(cameraButton);
