tags.uuabLocked = true;

//Add confirm question to see if they want to submit this
const confirm = await os.showConfirm({
    title: "Would you like to publish this launcher?",
    confirmText: "confirm",
    cancelText: "cancel"
});

if (confirm) {
    thisBot.submitUUAB();
}