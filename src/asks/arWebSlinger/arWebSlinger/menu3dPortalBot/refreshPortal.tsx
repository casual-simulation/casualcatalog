if (!masks.initialized) {
    return;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] invoke`);
}

const runId = uuid();
thisBot.vars.currentRunId = runId;

await os.sleep(0);

if (runId !== thisBot.vars.currentRunId) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ignore call because a newer one has occured.`);
    }

    return;
}

const menu3dDimension = tags.formAddress;

if (!links.menu3dParentBot) {
    const menu3dParentBot = create({
        space: 'tempLocal',
        form: 'nothing',
        scale: 0.5,
        anchorPoint: 'center',
        dimension: menu3dDimension,
        [menu3dDimension]: true,
        [menu3dDimension + 'X']: 0,
        [menu3dDimension + 'Y']: 0,
    })

    masks.menu3dParentBot = getLink(menu3dParentBot);
}

// [SLOP] This is lazy - we dont need to release menu 3d bots to the pool if they still exist in the menu portal.
const existingMenu3dBots = getBots(b => b.tags.menu3dBotType === 'root');
for (const menu3dBot of existingMenu3dBots) {
    links.menu3dBotPool.release(menu3dBot);
}

const menuPortal = configBot.tags.menuPortal;

// Store what menu portal we are currently showing.
masks.showingMenuPortal = menuPortal;

if (menuPortal) {
    const menuBots = getBots((b) => {
        return b.tags[menuPortal] === true
    })

    if (tags.debug) {
        const menuBotCreateTimes = menuBots.map((b) => {
            return { label: b.tags.label, abCreateTime: b.tags.abCreateTime }
        })

        console.log(`[${tags.system}.${tagName}] menuBotCreateTimes:`, menuBotCreateTimes);
    }

    // Sort bots to be in the same order that they appear in the menu portal.
    menuBots.sort((a, b) => {
        const aSortOrder = a.tags[menuPortal + 'SortOrder'] ?? 0;
        const bSortOrder = b.tags[menuPortal + 'SortOrder'] ?? 0;

        if (aSortOrder == bSortOrder) {
            const aCreateTime = a.tags.abCreateTime ?? 0;
            const bCreateTime = b.tags.abCreateTime ?? 0;

            // If a and b have the same sort order, then sort by creation time.
            return aCreateTime - bCreateTime;
        } else {
            return aSortOrder - bSortOrder;
        }
    });

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ${menuBots.length} bots found in menu portal '${menuPortal}':`, menuBots);
    }

    if (menuBots.length > 0) {
        menuBots.reverse();

        for (let i = 0; i < menuBots.length; i++) {
            const menuBot = menuBots[i];
            const menu3dBot = links.menu3dBotPool.retrieve();
            menu3dBot.configure({ menuBot, dimension: menu3dDimension });

            // Parent each menu3dBot to the menu3dParentBot.
            menu3dBot.tags.transformer = links.menu3dParentBot.id;
            
            menu3dBot.tags[menu3dDimension + 'Y'] = i * (links.menu3dBotPool.tags.menu3dBot_height + tags.menu3d_botSpacing)

        }
    }
} else {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] No menu portal is open.`);
    }
}