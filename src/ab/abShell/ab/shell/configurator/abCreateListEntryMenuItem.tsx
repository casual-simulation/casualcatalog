interface ABCreateListEntryMenuItemArg {
    abConfiguratorGroup: string;
    listMenuBot: Bot;
    listKey: string;
    itemSchema: ABConfiguratorProperty;
    index: number;
    entryValue: any;
}

const { abConfiguratorGroup, listMenuBot, listKey, itemSchema, index, entryValue } = that as ABCreateListEntryMenuItemArg ?? {};

const isComplex = itemSchema?.type === 'group';
const entrySynthKey = `${listKey}::${index}`;
const entrySortOrder = index * 2;
const removeSortOrder = index * 2 + 1;

const bubbleUpListenerStr = ListenerString(() => {
    const property = tags.property;
    if (!property) return;
    links.bubbleUpTarget.abUpdateListEntryValue({
        index: tags.listEntryIndex,
        fieldKey: tags.listEntryFieldKey ?? null,
        value: property.value,
    });
});

const entryBots: Bot[] = [];
let entryBot: Bot;

// Entries created via add (after the initial onABConfiguratorMenuOpened shout)
// otherwise miss the link to the master menuItemBots array. Copy from the list bot,
// which always has it. Used by the inherited onBotChanged for sibling whispers.
const inheritedMenuItemBots = listMenuBot.tags.menuItemBots;

if (isComplex) {
    const synthesizedGroupProperty = {
        type: 'group',
        key: entrySynthKey,
        label: `Entry #${index}`,
        properties: [],
    };

    entryBot = thisBot.abCreatePropertyMenuItem({
        abConfiguratorGroup,
        property: synthesizedGroupProperty,
        menuGroup: listKey,
        index: entrySortOrder,
    });

    entryBot.tags.listEntry = true;
    entryBot.tags.listOwnerKey = listKey;
    entryBot.tags.listEntryIndex = index;
    if (inheritedMenuItemBots) entryBot.tags.menuItemBots = inheritedMenuItemBots;
    entryBots.push(entryBot);

    // Title for the entry's sub-dimension.
    const entryTitle = ab.links.menu.abCreateMenuText({
        space: 'tempLocal',
        [`abConfiguratorMenu_${entrySynthKey}`]: true,
        [`abConfiguratorMenu_${entrySynthKey}SortOrder`]: Number.MIN_SAFE_INTEGER,
        listEntry: true,
        listOwnerKey: listKey,
        listEntryIndex: index,
        abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot); }),
        formAddress: 'folder',
        label: `Entry #${index}`,
        labelAlignment: 'center',
        menuItemStyle: {},
        menuItemLabelStyle: { 'font-weight': 'bold' },
    });
    entryBots.push(entryTitle);

    // Dedicated back button for this entry's sub-dimension. Pops the menu stack.
    const entryBackButton = ab.links.menu.abCreateMenuButton({
        space: 'tempLocal',
        [`abConfiguratorMenu_${entrySynthKey}`]: true,
        [`abConfiguratorMenu_${entrySynthKey}SortOrder`]: Number.MAX_SAFE_INTEGER,
        listEntry: true,
        listOwnerKey: listKey,
        listEntryIndex: index,
        abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot); }),
        manager: getLink(thisBot),
        formAddress: 'arrow_back',
        label: 'back',
        onClick: ListenerString(() => {
            const stack = links.manager.vars.menuStack ?? [];
            const prev = stack.pop();
            links.manager.vars.menuStack = stack;
            configBot.masks.menuPortal = prev ?? 'abConfiguratorMenu';
        }),
    });
    entryBots.push(entryBackButton);

    const fields = (itemSchema as ABConfiguratorPropertyGroup).properties ?? [];
    for (let f = 0; f < fields.length; f++) {
        const field = fields[f];
        const fieldValue = (entryValue && typeof entryValue === 'object') ? entryValue[field.key] : undefined;

        const synthesizedField = {
            ...field,
            key: `${entrySynthKey}::${field.key}`,
            label: field.label ?? field.key,
            value: fieldValue,
        };

        const fieldBot = thisBot.abCreatePropertyMenuItem({
            abConfiguratorGroup,
            property: synthesizedField,
            menuGroup: entrySynthKey,
            index: f,
        });

        fieldBot.tags.listEntry = true;
        fieldBot.tags.listEntryField = true;
        fieldBot.tags.listOwnerKey = listKey;
        fieldBot.tags.listEntryIndex = index;
        fieldBot.tags.listEntryFieldKey = field.key;
        fieldBot.tags.bubbleUpTarget = getLink(listMenuBot);
        fieldBot.tags.onPropertyValueBubbleUp = bubbleUpListenerStr;
        if (inheritedMenuItemBots) fieldBot.tags.menuItemBots = inheritedMenuItemBots;

        entryBots.push(fieldBot);
    }

    entryBot.tags.onRefreshDisplay = ListenerString(() => {
        const property = tags.property;
        const list = links.bubbleUpTarget?.tags?.property;
        const arr = Array.isArray(list?.value) ? list.value : (Array.isArray(list?.default) ? list.default : []);
        const item = arr[tags.listEntryIndex];
        let preview = '';
        if (item && typeof item === 'object') {
            const firstKey = Object.keys(item)[0];
            if (firstKey != null) {
                preview = `: ${firstKey}=${String(item[firstKey])}`;
            }
        }
        tags.label = (property.label ?? property.key) + preview;
    });

    entryBot.tags.bubbleUpTarget = getLink(listMenuBot);
    entryBot.tags.onPropertyValueBubbleUp = ListenerString(() => {});
} else {
    const synthesizedProperty: any = {
        ...itemSchema,
        key: entrySynthKey,
        label: `Entry #${index}`,
        value: entryValue,
    };

    entryBot = thisBot.abCreatePropertyMenuItem({
        abConfiguratorGroup,
        property: synthesizedProperty,
        menuGroup: listKey,
        index: entrySortOrder,
    });

    entryBot.tags.listEntry = true;
    entryBot.tags.listOwnerKey = listKey;
    entryBot.tags.listEntryIndex = index;
    entryBot.tags.bubbleUpTarget = getLink(listMenuBot);
    entryBot.tags.onPropertyValueBubbleUp = bubbleUpListenerStr;
    if (inheritedMenuItemBots) entryBot.tags.menuItemBots = inheritedMenuItemBots;

    // Most types' default onRefreshDisplay already produces "<label>: <value>"
    // (the synthesized label is "Entry #N"). Only text needs an override since
    // its default doesn't include the value, and only color/select/multiselect
    // would lose their tinting/option-resolution if we replaced theirs.
    if (itemSchema.type === 'text') {
        entryBot.tags.onRefreshDisplay = ListenerString(() => {
            const property = tags.property;
            const v = property.value ?? property.default;
            const valueStr = v == null || v === '' ? 'unset' : String(v);
            tags.label = `Entry #${tags.listEntryIndex}: ${valueStr}`;
        });
    }

    whisper(entryBot, 'onRefreshDisplay');

    entryBots.push(entryBot);
}

const removeBot = ab.links.menu.abCreateMenuButton({
    space: 'tempLocal',
    [`abConfiguratorMenu_${listKey}`]: true,
    [`abConfiguratorMenu_${listKey}SortOrder`]: removeSortOrder,
    dimension: `abConfiguratorMenu_${listKey}`,
    listOwnerKey: listKey,
    listEntryIndex: index,
    listRemoveButton: true,
    abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot); }),
    listOwnerBot: getLink(listMenuBot),
    formAddress: 'delete',
    label: `remove #${index}`,
    color: '#ffdddd',
    onClick: ListenerString(() => {
        links.listOwnerBot.abRemoveListEntry({ index: tags.listEntryIndex });
    }),
});

entryBots.push(removeBot);

return entryBots;
