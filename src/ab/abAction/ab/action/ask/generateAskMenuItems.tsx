const { menuType } = that ?? {};

const menuItems = [];

menuItems.push({
    label: 'ask ab',
    formAddress: 'cube',
    menuType,
    form: 'input',
    onCreate: ListenerString(() => {
        if (!authBot) {
            tags.label = 'ask ' + ab.links.personality.tags.abBuilderIdentity + ' (limited)';
        } else if (authBot.tags.subscriptionTier == 'FreePlay') {
            tags.label = 'ask ' + ab.links.personality.tags.abBuilderIdentity + ' (limited)';
        } else {
            tags.label = 'ask ' + ab.links.personality.tags.abBuilderIdentity;
        }

        // Store some ab menu state-specific tags when input is created.
        if (tags.menuType === 'core') {
            // Nothing.
        } else if (tags.menuType === 'grid') {
            tags.dimension = ab.links.remember.tags.abGridFocus.dimension;
            tags.dimensionX = ab.links.remember.tags.abGridFocus.position.x;
            tags.dimensionY = ab.links.remember.tags.abGridFocus.position.y;
        } else if (tags.menuType === 'bot') {
            tags.targetBot = ab.links.remember.tags.abBotFocus;
        } else if (tags.menuType === 'multipleBot') {
            const allTargetBots = ab.links.remember.links.abMultipleBotFocus;
            const targetArray = [];

            for (let i = 0; i < allTargetBots.length; i++)
            {
                targetArray.push(allTargetBots[i].id);
            }

            tags.targetBots = targetArray;
        } else {
            console.error(`ask input does not implement menu type '${tags.menuType}'`);
        }

        if (!links.baseSkill.tags.hasUserTypedBotText && !links.baseSkill.tags.hasUserSubmittedBotText) {
            os.sleep(links.baseSkill.tags.inputSuggestionWaitMS).then(() => {
                if (!links.baseSkill.tags.hasUserTypedBotText) {
                    // Choose a random from built-in suggestions.
                    const suggestions = links.baseSkill.tags.suggestions[tags.menuType];
                    const text = suggestions[math.randomInt(0, suggestions.length - 1)];

                    links.baseSkill.inputSuggestion({ inputBot: thisBot, text });
                }
            })

        }
    }),
    onInputTyping: ListenerString(() => {
        if (!tags.stopSuggestion) {
            tags.stopSuggestion = true;
        }
        
        if (!tags.hasUserTypedBotText) {
            setTagMask(links.baseSkill, 'hasUserTypedBotText', true, 'local');
        }
    }),
    onSubmit: ListenerString(() => {
        // Invoke abCoreMenuAction with ab menu state specific data when input is submitted.
        if (tags.menuType === 'core') {
            links.baseSkill.abCoreMenuAction({message: that.text, menu: 'core'});
        } else if (tags.menuType === 'grid') {
            links.baseSkill.abCoreMenuAction({message: that.text, menu: 'grid', dimension: tags.dimension, dimensionX: tags.dimensionX, dimensionY: tags.dimensionY});
        } else if (tags.menuType === 'bot') {
            links.baseSkill.abCoreMenuAction({message: that.text, menu: 'bot', bot: links.targetBot});
        } else if (tags.menuType === 'multipleBot') {
            links.baseSkill.abCoreMenuAction({message: that.text, menu: 'multipleBot', bots: tags.targetBots});
        } else {
            console.error(`ask input does not implement menu type '${tags.menuType}'`);
        }

        setTagMask(links.baseSkill, 'hasUserSubmittedBotText', true, 'local');
    })
})

// menuItems.push({
//     label: 'foo',
//     onClick: ListenerString(() => {
//         os.toast('bar');
//     })
// })

masks.menuItems = menuItems;