if (tags.abPatchCode) {
    thisBot.abPatchMenuOpen();
} else {
    thisBot.todoSetupMenu();
}
//thisBot.animateSpin();

console.log(await os.listFormAnimations())