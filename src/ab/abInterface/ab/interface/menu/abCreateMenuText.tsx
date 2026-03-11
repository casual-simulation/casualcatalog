if (!that) {
    return;
}

const {
    menuItemStyle,
    menuItemLabelStyle,
    ...rest
} = that;

let menuText = {
    form: "text",
    onPointerUp: null,
    onPointerDown: null,
    pointable: false,
    color: "white",
    menuItemStyle: {
        "padding-top": "6px",
        "padding-bottom": "6px",
        ...menuItemStyle,
    },
    menuItemLabelStyle: {
        "white-space": "pre-wrap",
        ...menuItemLabelStyle,
    },
    ...rest
};

const menuBot = thisBot.abCreateMenuButton(menuText);

return menuBot;