console.log(`[${tags.system}.${tagName}] that:`, that);

const bots = getBots('formAddress', that.address);

if (bots && bots.length) {
    destroy(bots);
    
    const videoBots = getBots('videoBot', true);
    sortBotsAZ(videoBots, 'sortOrder');

    shout('onVideoBotDestroyed', { videoBots });
}