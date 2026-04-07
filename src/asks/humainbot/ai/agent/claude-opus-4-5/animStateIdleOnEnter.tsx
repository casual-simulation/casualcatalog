os.startFormAnimation(thisBot, 'idle_smile', { crossFadeWarp: true, crossFadeDuration: 300, loop: { mode: 'repeat' } });

// Enter blink state randomly while idling.
const blinkTimeRange = [4500, 8000];
const blinkTime = math.random(blinkTimeRange[0], blinkTimeRange[1]);
thisBot.vars.idleBlinkTimeoutId = setTimeout(() => { thisBot.changeAnimState('Blink') }, blinkTime);