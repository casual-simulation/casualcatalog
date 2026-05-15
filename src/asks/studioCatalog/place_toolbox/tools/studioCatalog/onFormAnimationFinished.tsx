if (tags.hasCustomMesh) {
    return;
}

if (tags.currentFormAnimation == 'opening') {
    tags.currentFormAnimation = 'idle_open';
    os.startFormAnimation(thisBot, "idle_open", {
        loop: {
            mode: 'repeat' 
        }
    })
} else if (tags.currentFormAnimation == 'closing') {
    tags.currentFormAnimation = 'closed';
    os.startFormAnimation(thisBot, "closed", {
        clampWhenFinished: true
    })
}