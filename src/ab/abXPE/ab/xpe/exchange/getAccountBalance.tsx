assert(masks.initialized, `[${tags.system}.${tagName}] skill must be loaded before first.`);

if (tags.mock) {
    await os.sleep(100);
    return thisBot.vars.mockBalance;
} else {
    const balance = await xp.getAccountBalances();
    return balance;
}