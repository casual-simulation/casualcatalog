if (!that) {
    return;
}

let menuInput = {
    form: "input",
    menuItemShowSubmitWhenEmpty: false,
    formInputMultiline: null,
    onPointerUp: null,
    onPointerDown: null,
    ...that
};

const menuBot = thisBot.abCreateMenuButton(menuInput);

return menuBot;