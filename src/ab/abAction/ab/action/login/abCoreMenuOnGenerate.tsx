tags.abMenu = false; // Keep button hidden until auth check is complete.
await os.requestAuthBotInBackground();

if (authBot) {
    destroy(thisBot);
} else {
    tags.abMenu = true;
    tags.onABAuthBotAdded = `@destroy(thisBot);`;
}