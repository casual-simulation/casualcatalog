const hasFailAnimation = tags.formAnimations.some(a => a.name === 'thinking_out_fail');

if (hasFailAnimation) {
    os.startFormAnimation(thisBot, 'thinking_out_fail', { crossFadeWarp: true, crossFadeDuration: 500 });
} else {
    os.startFormAnimation(thisBot, 'thinking_out', { crossFadeWarp: true, crossFadeDuration: 500 });
}