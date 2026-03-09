console.log(thisBot.vars.setShowAll)
if (typeof thisBot.vars.setShowAll !== 'function') {
    return;
}

if (that === undefined) {
    thisBot.vars.setShowAll(s => !s);
} else if (that == true) {
    thisBot.vars.setShowAll(true);
} else {
    thisBot.vars.setShowAll(false);
}
