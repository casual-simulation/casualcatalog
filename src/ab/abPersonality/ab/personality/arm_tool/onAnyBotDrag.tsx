const dragBot = that.bot;
const dimension = that.from.dimension;

if (dragBot.tags.armSelection) {
    if (dragBot.masks.armBot) {
        if (dragBot.links.armBot.tags.multiSelect && dragBot.links.armSelectedBots && dragBot.tags.armGroupDrag) {
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

    const multiSelectKeyHeld = os.getInputState('keyboard', 'Shift');
    const multiSelectAllowed = dragBot.tags.armMultiSelect ?? true;

    const armBot = thisBot.abCreateArm({
        originBot: dragBot,
        dimension,
        multiSelect: multiSelectKeyHeld && multiSelectAllowed,
    })

    os.replaceDragBot(armBot);
}
