if (!tags.initialized)
{
    return;
}

const dim = that.from.dimension;
const dragBot = that.bot;

//MAY NEED TO REFINE THIS
const isFromHandledDimension = dim === 'home' || 
                               dim === mainSceneBot.tags.formAddress || 
                               dim === tags.leftWristPortalName;

if (!isFromHandledDimension) {
    return;
}

const isToBeIgnored = dragBot.tags.ignoreMainSceneHandler;
if (isToBeIgnored) {
    return;
}

dragBot.tags.mainSceneHandlerObserving = true;

if (tags.debug) {
    console.log(`[${tags.system}] add drop grids`);
}

os.addDropGrid(
    {
        portalBot: mainSceneBot,
        showGrid: false,
        priority: 100,
        bounds: { x: 10000, y: 10000 }
    },
    {
        portalBot: configBot,
        portalTag: 'leftWristPortal',
        priority: 200,
        showGrid: true,
        position: { x: 3, y: 2, z: 0 },
        bounds: { x: 10, y: 10 }
    }
)
