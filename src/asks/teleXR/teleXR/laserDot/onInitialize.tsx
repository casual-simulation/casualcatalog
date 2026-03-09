masks.initialized = true;

// Call sendLaserDot in an infinite loop.
while(true) {
    try {
        if (thisBot.sendLaserDot) {
            await thisBot.sendLaserDot();
        }
    } finally {
        await os.sleep(tags.sendRateMS);
    }
}