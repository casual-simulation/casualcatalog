assert(masks.initialized, `[${tags.system}.${tagName}] skill must be loaded before first.`);

if (tags.mock) {
    await os.sleep(100);
    return thisBot.vars.mockBalance;
} else {
    const balanceResult = await xp.getAccountBalances();

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] balanceResult:`, balanceResult);
    }
    
    if (balanceResult.success) {
        return balanceResult.credits;
    } else {
        return null;
    }
}