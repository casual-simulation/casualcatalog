const inputMenuItem = getBot("abGuideInputBox", true);

if (!inputMenuItem) {
    return;
}

inputMenuItem.masks.menuItemText = that;