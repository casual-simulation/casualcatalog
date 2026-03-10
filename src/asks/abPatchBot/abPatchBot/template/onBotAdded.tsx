let waitTime = 0;

while(!globalThis.ab?.links.bot_factory) {
    if (waitTime >= 5000) {
        return;
    }
    
    await os.sleep(250);
    waitTime += 250;
}

masks.ready = true;

thisBot.updatePatchColor();
thisBot.updateBillboardLabel();