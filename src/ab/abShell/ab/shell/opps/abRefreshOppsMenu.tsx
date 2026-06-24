// Syncs the live "show me" > opps dropdown with the active-opp cache. Called from every cache
// mutation (create / complete / erase / expire / refresh).

const btn = getBot('baseSkill', getLink(thisBot));

if (!btn) {
    // No live button: menu closed (nothing to do), or Show menu open with the opps entry hidden
    // (zero opps at open time). A new opp in that second case needs the menu re-rendered to appear.
    const opps = Array.isArray(thisBot.vars.activeOpps) ? thisBot.vars.activeOpps : [];
    if (opps.length === 0) return;
    if (!configBot.tags.menuPortal) return; // no menu open

    // Only re-render if the open menu is the Show menu (its buttons link a skill with abShowMenuAction).
    const showMenuOpen = getBots('abMenu', true)
        .some(b => b.links.baseSkill?.tags?.abShowMenuAction != null);
    if (showMenuOpen) {
        shout('abMenuRefresh');
        ab.links.menu.abOpenMenu('Show');
    }
    return;
}

thisBot.abShowMenuOnBeforeCreate();

if (tags.abShowMenuHide) {
    // Dropped to zero opps — remove the entry (returns on next open).
    if (btn.tags.dropdownOpen) {
        whisper(btn.links.menuBots, 'clearDropdownMenu');
    }
    destroy(btn);
    return;
}

btn.tags.dropdownOptions = tags.dropdownOptions;

// Regenerate open options in place by toggling closed/open.
if (btn.tags.dropdownOpen) {
    btn.onClick();
    btn.onClick();
}
