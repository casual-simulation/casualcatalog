const { portal, dimension } = that;

if (portal === 'menuPortal') {
    if (!dimension) {
        thisBot.abStartArmNudge();
    }
}