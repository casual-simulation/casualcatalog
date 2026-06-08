masks.chatOpen = false;
os.hideChat();

shout('onABChatBarClose');

// Give CasualOS a change to actually remove the chat bar.
await os.sleep(0);