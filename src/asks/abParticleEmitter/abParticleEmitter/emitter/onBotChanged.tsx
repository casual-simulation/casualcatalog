let onChanged = false;
let pauseChanged = false;

for (let tag of that.tags) {
    if (tag === 'particleOn') {
        onChanged = true;
    } else if (tag === 'particlePause') {
        pauseChanged = true;
    }
}

if (onChanged) {
    if (tags.particleOn) {
        thisBot.vars.particleElapsed = 0;
        thisBot.vars.particleBurstTimer = 0;
        os.toast("▶ Emitter ON");
    } else {
        os.toast("⏹ Emitter OFF");
    }
}

if (pauseChanged) {
    if (tags.particlePause) {
        os.toast("▶ Emitter PAUSE");
    } else {
        os.toast("▶ Emitter RESUME");
    }
}