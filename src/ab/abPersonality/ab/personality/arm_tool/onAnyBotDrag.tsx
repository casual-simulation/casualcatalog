const dragBot = that.bot;
const dimension = that.from.dimension;

if (dragBot.tags.armSelection) {
    if (dragBot.masks.armBot) {
        if (dragBot.links.armBot.tags.multiSelect && Array.isArray(dragBot.links.armSelectedBots) && dragBot.tags.armGroupDrag) {
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] enable custom dragging`);
            }

            os.enableCustomDragging();
            return;
        } else {
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] destroy previous armBot: ${dragBot.masks.armBot}`);
            }

            destroy(dragBot.links.armBot);
            dragBot.masks.armBot = null;
        }
    }

    
    let multiSelect;
    
    const multiSelectAllowed = dragBot.tags.armMultiSelect ?? true;
    if (multiSelectAllowed) {
        const multiSelectDefault = dragBot.tags.armMultiSelectDefault ?? false;
        multiSelect = multiSelectDefault;

        const modeShiftKeyHeld = os.getInputState('keyboard', 'Shift');
        if (modeShiftKeyHeld) {
            multiSelect = !multiSelect;
        }
    } else {
        multiSelect = false;
    }

    const armBot = thisBot.abCreateArm({
        originBot: dragBot,
        dimension,
        multiSelect,
    })

    os.replaceDragBot(armBot);
}
