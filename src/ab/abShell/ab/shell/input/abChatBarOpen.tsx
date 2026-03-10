if (ab.links.remember.tags.abAllowChatBar === false) {
    return;
}

const {
    prefill,
} = that ?? {}

masks.chatOpen = true;

os.showChat({
    placeholder: '> .help to see available commands',
    backgroundColor: links.personality.tags.abBaseMenuColor,
    foregroundColor: links.personality.tags.abBaseMenuLabelColor,
    placeholderColor: links.personality.tags.abBaseMenuLabelColor,
    prefill
})

shout('onABChatBarOpen', { prefill });