const data = tags.userAskData;
if (!data) return;

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
    patchBot: getLink(thisBot),
    groupSortOrder: 100,
    menuItems: [],
};

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
    const current = tags.userAskAnswer ?? null;
    for (const option of options) {
        const isSelected = current === option;
        menuOptions.menuItems.push({
            label: option,
            formAddress: isSelected ? 'radio_button_checked' : 'radio_button_unchecked',
            onClick: ListenerString(() => {
                setTag(links.patchBot, 'userAskAnswer', thisBot.tags.label);
                whisper(links.patchBot, 'userAskTodoSubmit');
            }),
        });
    }
    if (allowOther) {
        const isOtherActive = current != null && !options.includes(current);
        menuOptions.menuItems.push({
            label: isOtherActive ? `Other: ${current}` : 'Other...',
            formAddress: isOtherActive ? 'radio_button_checked' : 'edit',
            onClick: ListenerString(async () => {
                const text = await os.showInput(links.patchBot.tags.userAskAnswer ?? '', { placeholder: 'Type your answer' });
                if (text != null && text !== '') {
                    setTag(links.patchBot, 'userAskAnswer', text);
                    whisper(links.patchBot, 'userAskTodoSubmit');
                }
            }),
        });
    }
} else if (questionType === 'multiselect') {
    const selected: string[] = Array.isArray(tags.userAskAnswer) ? tags.userAskAnswer : [];
    for (const option of options) {
        const isChecked = selected.includes(option);
        menuOptions.menuItems.push({
            label: option,
            formAddress: isChecked ? 'check_box' : 'check_box_outline_blank',
            onClick: ListenerString(() => {
                const cur = Array.isArray(links.patchBot.tags.userAskAnswer)
                    ? links.patchBot.tags.userAskAnswer.slice()
                    : [];
                const optLabel = thisBot.tags.label;
                const idx = cur.indexOf(optLabel);
                if (idx >= 0) cur.splice(idx, 1); else cur.push(optLabel);
                setTag(links.patchBot, 'userAskAnswer', cur);
                whisper(links.patchBot, 'abPatchTodoMenuOpen');
            }),
        });
    }
    if (allowOther) {
        const otherEntries = selected.filter(s => !options.includes(s));
        menuOptions.menuItems.push({
            label: otherEntries.length > 0 ? `Other: ${otherEntries.join(', ')}` : 'Other...',
            formAddress: otherEntries.length > 0 ? 'check_box' : 'edit',
            onClick: ListenerString(async () => {
                const text = await os.showInput('', { placeholder: 'Type your answer' });
                if (text != null && text !== '') {
                    const cur = Array.isArray(links.patchBot.tags.userAskAnswer)
                        ? links.patchBot.tags.userAskAnswer.slice()
                        : [];
                    cur.push(text);
                    setTag(links.patchBot, 'userAskAnswer', cur);
                    whisper(links.patchBot, 'abPatchTodoMenuOpen');
                }
            }),
        });
    }
    menuOptions.menuItems.push({
        label: 'Submit',
        formAddress: 'send',
        onClick: ListenerString(() => {
            whisper(links.patchBot, 'userAskTodoSubmit');
        }),
    });
} else if (questionType === 'custom') {
    const current = tags.userAskAnswer;
    menuOptions.menuItems.push({
        label: current
            ? `Answer: ${current.length > 40 ? current.slice(0, 40) + '...' : current}`
            : 'Provide answer',
        formAddress: current ? 'edit_note' : 'edit',
        onClick: ListenerString(async () => {
            const text = await os.showInput(links.patchBot.tags.userAskAnswer ?? '', { placeholder: 'Type your answer', multiline: true });
            if (text != null && text !== '') {
                setTag(links.patchBot, 'userAskAnswer', text);
                whisper(links.patchBot, 'userAskTodoSubmit');
            }
        }),
    });
}

ab.links.menu.abCreateMenuGroup(menuOptions);
