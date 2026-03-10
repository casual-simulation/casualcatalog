if (that.modality === 'touch') {
    const dimension = that.dimension;
    const position = that.position;

    // Add this touch to the cursor queue for the next tick.
    const cursorQueue: ABUserPresenceQueuedCursorData[] = thisBot.vars.cursorQueue;

    cursorQueue.push({
        pointerType: 'touch',
        dimension,
        position: { x: position.x, y: position.y, z: position.z },
    })

    thisBot.onTick();
}