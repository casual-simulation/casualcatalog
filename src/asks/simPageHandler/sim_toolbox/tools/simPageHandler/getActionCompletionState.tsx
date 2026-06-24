const actionSimID = that;

if (!authBot) {
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    os.toast("user not logged in.");
    return;
}

const foundAction = tags.completedActions.includes(that);

if (foundAction) {
    return true;
} else {
    return false;
}