const data = tags.userAskData;
if (!data) return;

// Generation token set by abPatchTodoMenuOpen — see the comment there. Stamp our bots with it
// and drop them at the end if a newer render has superseded us.
const renderToken = masks.menuRenderToken;

const questionType: string = data.questionType;
const question: string = data.question;
const options: string[] = Array.isArray(data.options) ? data.options : [];
const allowOther: boolean = data.allowOther !== false;

const siblings = getBots(b =>
    b.tags.isUserAskTodo && b.tags.todoPlanId === tags.todoPlanId
);
const chainComplete = siblings.length > 0 && siblings.every(b => b.tags.abTodoComplete);

const menuOptions: any = {
    abPatchTodoMenu: true,
    abPatchTodoMenuSortOrder: 0,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    menuRenderToken: renderToken,
    patchBot: getLink(thisBot),
    groupSortOrder: 100,
    menuItems: [],
};

// Question label
menuOptions.menuItems.push({
    label: question,
    menuItemType: 'button',
    formAddress: 'help',
    menuItemStyle: { 'padding-top': '6px', 'padding-bottom': '6px' },
    menuItemLabelStyle: { 'font-style': 'italic' },
});

if (chainComplete) {
    const answer = tags.userAskAnswer;
    const display = Array.isArray(answer)
        ? (answer.length > 0 ? answer.join(', ') : '(none)')
        : (answer ?? '(no answer)');
    menuOptions.menuItems.push({
        label: display,
        menuItemType: 'text',
        formAddress: 'check_circle',
        menuItemStyle: { 'padding-top': '6px', 'padding-bottom': '6px' },
    });
} else if (questionType === 'select') {
    for (const option of options) {
        menuOptions.menuItems.push({
            label: option,
            userAskOptionLabel: option,
            formAddress: tags.userAskAnswer === option ? 'radio_button_checked' : 'radio_button_unchecked',
            onClick: ListenerString(() => {
                setTag(links.patchBot, 'userAskAnswer', thisBot.tags.userAskOptionLabel);
                setTag(links.patchBot, 'userAskOtherText', null);
                shout('userAskRefreshSelect');
            }),
            userAskRefreshSelect: ListenerString(() => {
                const cur = links.patchBot.tags.userAskAnswer;
                masks.formAddress = cur === thisBot.tags.userAskOptionLabel
                    ? 'radio_button_checked'
                    : 'radio_button_unchecked';
            }),
        });
    }
    if (allowOther) {
        menuOptions.menuItems.push({
            label: 'Other',
            menuItemType: 'input',
            formAddress: 'edit',
            placeholder: 'Type a custom answer',
            onCreate: ListenerString(() => {
                const text = links.patchBot.tags.userAskOtherText;
                masks.menuItemText = text ?? '';
            }),
            onInputTyping: ListenerString(() => {
                const text = String(that.text ?? '');
                setTag(links.patchBot, 'userAskOtherText', text || null);
                if (text) {
                    setTag(links.patchBot, 'userAskAnswer', null);
                    shout('userAskRefreshSelect');
                }
            }),
            userAskRefreshSelect: ListenerString(() => {
                if (links.patchBot.tags.userAskAnswer != null) {
                    masks.menuItemText = '';
                }
            }),
        });
    }
    menuOptions.menuItems.push({
        label: 'Submit',
        formAddress: 'send',
        onClick: ListenerString(() => {
            const otherText = links.patchBot.tags.userAskOtherText;
            if (otherText) {
                setTag(links.patchBot, 'userAskAnswer', otherText);
            }
            whisper(links.patchBot, 'userAskTodoSubmit');
        }),
    });
} else if (questionType === 'multiselect') {
    for (const option of options) {
        menuOptions.menuItems.push({
            label: option,
            userAskOptionLabel: option,
            formAddress: (Array.isArray(tags.userAskAnswer) && tags.userAskAnswer.includes(option))
                ? 'check_box'
                : 'check_box_outline_blank',
            onClick: ListenerString(() => {
                const cur = Array.isArray(links.patchBot.tags.userAskAnswer)
                    ? links.patchBot.tags.userAskAnswer.slice()
                    : [];
                const optLabel = thisBot.tags.userAskOptionLabel;
                const idx = cur.indexOf(optLabel);
                if (idx >= 0) cur.splice(idx, 1); else cur.push(optLabel);
                setTag(links.patchBot, 'userAskAnswer', cur);
                masks.formAddress = cur.includes(optLabel) ? 'check_box' : 'check_box_outline_blank';
            }),
        });
    }
    if (allowOther) {
        menuOptions.menuItems.push({
            label: 'Other',
            menuItemType: 'input',
            formAddress: 'edit',
            placeholder: 'Type a custom answer to add',
            onCreate: ListenerString(() => {
                const text = links.patchBot.tags.userAskOtherText;
                masks.menuItemText = text ?? '';
            }),
            onInputTyping: ListenerString(() => {
                const text = String(that.text ?? '');
                setTag(links.patchBot, 'userAskOtherText', text || null);
            }),
        });
    }
    menuOptions.menuItems.push({
        label: 'Submit',
        formAddress: 'send',
        onClick: ListenerString(() => {
            const otherText = links.patchBot.tags.userAskOtherText;
            const cur = Array.isArray(links.patchBot.tags.userAskAnswer)
                ? links.patchBot.tags.userAskAnswer.slice()
                : [];
            if (otherText && !cur.includes(otherText)) {
                cur.push(otherText);
            }
            setTag(links.patchBot, 'userAskAnswer', cur);
            whisper(links.patchBot, 'userAskTodoSubmit');
        }),
    });
} else if (questionType === 'custom') {
    menuOptions.menuItems.push({
        label: 'Answer',
        menuItemType: 'input',
        formAddress: 'edit',
        placeholder: 'Type your answer',
        formInputMultiline: true,
        onCreate: ListenerString(() => {
            const text = links.patchBot.tags.userAskAnswer;
            masks.menuItemText = text ?? '';
        }),
        onInputTyping: ListenerString(() => {
            const text = String(that.text ?? '');
            setTag(links.patchBot, 'userAskAnswer', text || null);
        }),
    });
    menuOptions.menuItems.push({
        label: 'Submit',
        formAddress: 'send',
        onClick: ListenerString(() => {
            whisper(links.patchBot, 'userAskTodoSubmit');
        }),
    });
}

await ab.links.menu.abCreateMenuGroup(menuOptions);

if (masks.menuRenderToken !== renderToken) {
    destroy(getBots('menuRenderToken', renderToken));
}
