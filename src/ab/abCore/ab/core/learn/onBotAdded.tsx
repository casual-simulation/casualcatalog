console.log(`[${tags.system}.${tagName}] abCore START UP`);

thisBot.abInstUpdate();

if (!links.remember) {
    console.error(`[${tags.system}.${tagName}] Could not find abConfig remember bot.`);
}

setTimeout(() => thisBot.abBoot(), 500);