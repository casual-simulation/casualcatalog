if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout("clearStoryRecipeMenu");

configBot.tags.menuPortal = 'storyRecipe_menu';

const menuOptions = {
    storyRecipe_menu: true,
    clearStoryRecipeMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@destroy(thisBot);",
    recipe: getLink(thisBot)
}

const setAButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'element',
    storyRecipe_menuSortOrder: 1,
    onCreate: `@
        masks.menuItemText = links.recipe.tags.dropped ?? '';
    `,
    onSubmit: `@
        links.recipe.tags.dropped = that.text;
    `,
    onInputTyping: `@
        links.recipe.tags.dropped = that.text;
    `
}

const setBButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: '+ element',
    storyRecipe_menuSortOrder: 2,
    onCreate: `@
        masks.menuItemText = links.recipe.tags.droppedOn ?? '';
    `,
    onSubmit: `@
        links.recipe.tags.droppedOn = that.text;
    `,
    onInputTyping: `@
        links.recipe.tags.droppedOn = that.text;
    `
}

const setCButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: '= element',
    storyRecipe_menuSortOrder: 3,
    onCreate: `@
        masks.menuItemText = links.recipe.tags.result ?? '';
    `,
    onSubmit: `@
        links.recipe.tags.result = that.text;
    `,
    onInputTyping: `@
        links.recipe.tags.result = that.text;
    `
}

const fuzzButton = {
    ...menuOptions,
    formAddress: tags.fuzzy ? 'toggle_on' : 'toggle_off',
    label: 'fuzzy',
    storyRecipe_menuSortOrder: 4,
    onClick: `@
        links.recipe.tags.fuzzy = !links.recipe.tags.fuzzy ?? true;
        if (links.recipe.tags.fuzzy) {
            tags.formAddress = 'toggle_on';
        } else {
            tags.formAddress = 'toggle_off';
        }
    `
}

ab.links.menu.abCreateMenuInput(setAButton); 
ab.links.menu.abCreateMenuInput(setBButton);
ab.links.menu.abCreateMenuInput(setCButton); 
ab.links.menu.abCreateMenuButton(fuzzButton);   