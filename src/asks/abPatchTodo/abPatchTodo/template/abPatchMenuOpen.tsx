shout('abPatchMenuReset');

configBot.masks.menuPortal = 'abPatchMenu';

// This bot handles removing this menu if the patch bot that created it gets destroyed.
create({
    space: 'tempLocal',
    patchBotId: thisBot.id,
    abPatchMenuReset: `@destroy(thisBot)`,
    onBotAdded: `@
        const patchBot = getBot('id', tags.patchBotId);
        if (!patchBot) {
            // The patch bot was deleted before the menu opened.
            shout('abPatchMenuReset');
        }
    `,
    onAnyBotsRemoved: `@
        const { botIDs } = that;

        if (botIDs.includes(tags.patchBotId)) {
            shout('abPatchMenuReset');
        }
    `,
})

/**
 * Menu group for this patch bot.
 */
const patchMenuGroup = {
    groupSortOrder: 100,
    abPatchMenu: true,
    abPatchMenuReset: `@destroy(thisBot)`,
    patchBot: getLink(thisBot),
    color: tags.abPatchColor,
    menuItems: []
}

patchMenuGroup.menuItems.push({
    label: `${tags.prompt}`,
    menuItemType: 'text',
    formAddress: 'notes',
    menuItemStyle: {
        "padding-top": "6px",
        "padding-bottom": "6px",
    },
    menuItemLabelStyle: {
        "font-style": "italic"
    }
});

if (tags.abPatchError) {
    patchMenuGroup.menuItems.push({
        label: `${tags.abPatchError}`,
        menuItemType: 'text',
        formAddress: 'error',
        color: 'firebrick',
        labelColor: 'white',
        menuItemStyle: {
            "padding-top": "6px",
            "padding-bottom": "6px",
        },
    });
}

if (tags.abPatchInvalid) {
    patchMenuGroup.menuItems.push({
        label: 'dispose patch',
        formAddress: 'delete',
        onClick: `@
            destroy(links.patchBot);
        `
    });
} else {
    patchMenuGroup.menuItems.push({
        label: 'approve patch',
        formAddress: 'done',
        onClick: `@
            if (links.patchBot.tags.abPatchTodoInstance) {
                whisper(links.patchBot, 'onABPatchApproveClick');
            } else {
                os.toast('do nothing: this is a patch bot template');
            }
        `
    });

    patchMenuGroup.menuItems.push({
        label: 'undo patch',
        formAddress: 'undo',
        onClick: `@
            if (links.patchBot.tags.abPatchTodoInstance) {
                whisper(links.patchBot, 'onABPatchUndoClick');
            } else {
                os.toast('do nothing: this is a patch bot template');
            }
        `
    });
}

patchMenuGroup.menuItems.push({
    label: 'try again',
    formAddress: 'replay',
    onClick: ListenerString(() => {
        if (links.patchBot.tags.abPatchTodoInstance) {
            whisper(links.patchBot, 'onABPatchTryAgainClick');
        } else {
            os.toast('do nothing: this is patch bot template');
        }
    })
})

ab.links.menu.abCreateMenuGroup(patchMenuGroup);

/**
 * Menu group for applying/undoing "all" patch bots.
 */
if (!tags.abPatchInvalid) {
    const abAppliedPatchBots = thisBot.abGetAppliedPatchBots();
    
    if (abAppliedPatchBots.length > 1) {
        const allPatchesMenuGroup = {
            groupSortOrder: 200,
            abPatchMenu: true,
            abPatchMenuReset: `@destroy(thisBot)`,
            patchBot: getLink(thisBot),
            color: tags.abPatchColor,
            menuItems: [
                {
                    label: 'approve all patches',
                    formAddress: 'done_all',
                    onClick: `@
                        if (links.patchBot.tags.abPatchTodoInstance) {
                            whisper(links.patchBot, 'onABPatchApproveAllClick');
                        } else {
                            os.toast('do nothing: this is a patch bot template');
                        }
                    `
                },
                {
                    label: 'undo all patches',
                    formAddress: 'fast_rewind',
                    onClick: `@
                        if (links.patchBot.tags.abPatchTodoInstance) {
                            whisper(links.patchBot, 'onABPatchUndoAllClick');
                        } else {
                            os.toast('do nothing: this is a patch bot template');
                        }
                    `
                }
            ]
        }

        ab.links.menu.abCreateMenuGroup(allPatchesMenuGroup);
    }
}