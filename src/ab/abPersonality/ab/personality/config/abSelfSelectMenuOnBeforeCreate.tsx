const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const abName = {
    ...menuOptions,
    label: `name: ${tags.abBuilderIdentity}`,
    formAddress: "cube",
    onClick: ListenerString(async () => {
        const name = await os.showInput(links.skillBot.tags.abBuilderIdentity, { title: 'what would you like to call me?' });
        shout('abPersonalityChange', { abBuilderIdentity: name });
        destroy(ab.links.manifestation.links.abBot);
    }),
}

const aiModel = {
    ...menuOptions,
    label: `ai model: ${tags.abPreferredAIModel}`,
    formAddress: "edit_note",
    onClick: ListenerString(async () => {
        const models = configBot.tags.aiChatModels;

        if (models) {
            const options = [];

            for (const entry of models) {
                options.push({ label: entry.name, value: entry.name });
            }

            const currentModelIndex = options.findIndex(o => o.value === links.skillBot.tags.abPreferredAIModel);

            const selectedOption = await os.showInput(currentModelIndex, {
                title: 'what ai model would you like me to use?',
                type: 'list',
                items: options,
            });

            if (selectedOption && selectedOption.value !== links.skillBot.tags.abPreferredAIModel) {
                shout('abPersonalityChange', { abPreferredAIModel: selectedOption.value });
                destroy(ab.links.manifestation.links.abBot);
            }
        } else {
            if (authBot) {
                os.showAlert({
                    title: 'something went wrong',
                    content: 'failed to get list of ai chat models.'
                })
            } else {
                os.showAlert({
                    title: 'sign in required',
                    content: 'you must sign in to use ai.'
                })
            }
        }
    }),
}

const aiPrompt = {
    ...menuOptions,
    label: 'ai prime directive prompt',
    formAddress: "edit_note",
    onClick: ListenerString(() => {
        const currentValue = ab.links.personality.tags.abPrimeDirectivePrompt;
        const unsetValue = ab.links.personality.tags.abUnsetValue;

        links.menu.abShowTextInputMenu({
            title: 'ai prime directive prompt',
            placeholder: 'who you are, what matters most right now, and how i should operate?',
            currentValue: (currentValue && currentValue != unsetValue) ? currentValue : null,
            onSubmitCallback: (listenerThat) => {
                const abPrimeDirectivePrompt = listenerThat.text || unsetValue;
                shout('abPersonalityChange', { abPrimeDirectivePrompt });

                if (abPrimeDirectivePrompt === unsetValue) {
                    ab.links.log_record.abWriteToLogRecord({ content: `User has cleared their prime directive prompt.`})
                } else {
                    ab.links.log_record.abWriteToLogRecord({ content: `User has updated their prime directive prompt: ${abPrimeDirectivePrompt}`});
                }
            }
        })
    }),
}

const aiPersonalPrompt = {
    ...menuOptions,
    label: 'ai personalization prompt',
    formAddress: "edit_note",
    onClick: ListenerString(() => {
        const currentValue = ab.links.personality.tags.abPersonalizationPrompt;
        const unsetValue = ab.links.personality.tags.abUnsetValue;

        links.menu.abShowTextInputMenu({
            title: 'ai personalization prompt',
            placeholder: 'how are you doing?',
            currentValue: (currentValue && currentValue != unsetValue) ? currentValue : null,
            onSubmitCallback: (listenerThat) => {
                const abPersonalizationPrompt = listenerThat.text || unsetValue;
                shout('abPersonalityChange', { abPersonalizationPrompt });

                if (abPersonalizationPrompt === unsetValue) {
                    ab.links.log_record.abWriteToLogRecord({ content: `User has cleared their personalization prompt.`})
                } else {
                    ab.links.log_record.abWriteToLogRecord({ content: `User has updated their personalization prompt: ${abPersonalizationPrompt}`});
                }
            }
        })
    }),
}

const autoAssign = {
    ...menuOptions,
    label: `auto assign todo agents: ${tags.abAutoAssignAgentToTodo ? 'yes' : 'no'}`,
    formAddress: 'edit_note',
    onClick: ListenerString(async () => {
        shout('abPersonalityChange', { abAutoAssignAgentToTodo: !links.skillBot.tags.abAutoAssignAgentToTodo });
        shout('abMenuRefresh');
    })
}

const abColor = {
    ...menuOptions,
    label: `color: ${tags.abBaseColor}`,
    formAddress: "edit_note",
    onClick: ListenerString(async () => {
        const color = await os.showInput(links.skillBot.tags.abBaseColor, { type: 'color', title: 'what color would you like me to be?' });
        shout('abPersonalityChange', { abBaseColor: color, abBaseStrokeColor: color });
        destroy(ab.links.manifestation.links.abBot);
    }),
}

const menuColor = {
    ...menuOptions,
    label: `menu color: ${tags.abBaseMenuColor}`,
    formAddress: "edit_note",
    onClick: ListenerString(async () => {
        const color = await os.showInput(links.skillBot.tags.abBaseMenuColor, { type: 'color', title: 'what color would you like my menus to be?' });
        shout('abPersonalityChange', { abBaseMenuColor: color });
        shout('abMenuRefresh');
    }),
}

const menuTextColor = {
    ...menuOptions,
    label: `menu text color: ${tags.abBaseMenuLabelColor}`,
    formAddress: "edit_note",
    onClick: ListenerString(async () => {
        const color = await os.showInput(links.skillBot.tags.abBaseMenuLabelColor, { type: 'color', title: 'what color would you like my menu text to be?' });
        shout('abPersonalityChange', { abBaseMenuLabelColor: color, abBaseShadowColor: color });
        shout('abMenuRefresh');
    }),
}

const botLabelColor = {
    ...menuOptions,
    label: `bot label color: ${tags.abBaseLabelColor}`,
    formAddress: "edit_note",
    onClick: ListenerString(async () => {
        const color = await os.showInput(links.skillBot.tags.abBaseLabelColor, { type: 'color', title: 'what color would you like my bot text to be?' });
        shout('abPersonalityChange', { abBaseLabelColor: color });
        shout('abMenuRefresh');
    }),
}

const portalColor = {
    ...menuOptions,
    label: `default portal color: ${tags.abBaseGridPortalColor ?? links.remember.tags.abBaseGridPortalColor ?? '#263238'}`,
    formAddress: "edit_note",
    onClick: ListenerString(async () => {
        let portalColor = await os.showInput(links.skillBot.tags.abBaseGridPortalColor ?? ab.links.remember.tags.abBaseGridPortalColor ?? '#263238', { type: 'color', title: 'what would you like your portal to look like?' });
        if (!portalColor) {
            portalColor = '#263238';
        }
        shout('abPersonalityChange', { abBaseGridPortalColor: portalColor });
    }),
}

const mapBasemap = {
    ...menuOptions,
    label: `default map portal basemap: ${tags.abMapPortalBase}`,
    formAddress: "edit_note",
    onClick: ListenerString(() => {
        shout("showABBasemapOptions");
    }),
}

const defaultButton = {
    ...menuOptions,
    label: "default settings",
    formAddress: "delete_forever",
    color: 'red',
    labelColor: 'black',
    onClick: ListenerString(() => {
        shout('abPersonalityReset');
        destroy(ab.links.manifestation.links.abBot);
    }),
}

dropdownOptions.push(abName);
dropdownOptions.push(aiModel);
dropdownOptions.push(aiPrompt);
dropdownOptions.push(aiPersonalPrompt);
dropdownOptions.push(autoAssign);
dropdownOptions.push(abColor);
dropdownOptions.push(menuColor);
dropdownOptions.push(menuTextColor);
dropdownOptions.push(botLabelColor);
dropdownOptions.push(portalColor);
dropdownOptions.push(mapBasemap);
dropdownOptions.push(defaultButton);

masks.dropdownOptions = dropdownOptions;