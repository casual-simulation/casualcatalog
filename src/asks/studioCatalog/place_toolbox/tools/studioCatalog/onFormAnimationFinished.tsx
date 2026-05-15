if (tags.hasCustomMesh) {
    return;
}

if (tags.currentFormAnimation == 'opening') {
    tags.currentFormAnimation = 'idle_open';
    // os.startFormAnimation(thisBot, "idle_open", {
    //     loop: {
    //         mode: 'repeat' 
    //     }
    // })
    tags.formAnimation = 'idle_open';
} else if (tags.currentFormAnimation == 'closing') {
    tags.currentFormAnimation = 'closed';
    // os.startFormAnimation(thisBot, "closed", {
    //     loop: {
    //         mode: 'repeat' 
    //     }
    // })
    tags.formAnimation = 'closed';
}