// This is used to set the console to the correct open/closed state on initialization based on the local mask value. 
// This is necessary because the console's open/closed state is stored in a local mask, and we need to ensure 
// that the console reflects this state when the bot is initialized.
if (masks.open) {
    setTagMask(thisBot, 'open', false, 'local');
    thisBot.showConsole();
} else {
    setTagMask(thisBot, 'open', true, 'local');
    thisBot.hideConsole();
}