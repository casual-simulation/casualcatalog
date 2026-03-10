if (!that) {
    return;
}

let menuWizard = {
    ...that
};

const menuBot = thisBot.abCreateMenuButton(menuWizard);

return menuBot;