const { message } = that;

if (message === 'differ') {
    await thisBot.unmount();
    await thisBot.mount();

    os.hideChat();
}