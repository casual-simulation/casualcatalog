if (that.tags.includes('targetPosition') && tags.targetPosition) {
    const target = tags.targetPosition;
    const dim = target.dimension;
    const fromX = tags[dim + 'X'] ?? 0;
    const fromY = tags[dim + 'Y'] ?? 0;
    const dx = target.x - fromX;
    const dy = target.y - fromY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = tags.moveSpeed ?? 2;

    if (dist > 0) {
        clearAnimations(thisBot);
        masks.moving = true;
        await animateTag(thisBot, {
            fromValue: {
                [dim + 'X']: fromX,
                [dim + 'Y']: fromY,
            },
            toValue: {
                [dim + 'X']: target.x,
                [dim + 'Y']: target.y,
            },
            duration: dist / speed,
            tagMaskSpace: 'tempLocal'
        }).catch(() => {});
        masks.moving = false;
    }
}

if (that.tags.includes('agentArm')) {
    if (tags.agentArm) {
        if (!links.armBot) {
            links.arm_tool.abCreateArm({
                originBot: thisBot,
                dimension: tags.agentArm.dimension,
                position: { x: tags.agentArm.position?.x ?? 0, y: tags.agentArm.position?.y ?? 0, z: 0 },
            });
        }
    } else {
        if (links.armBot) {
            destroy(links.armBot);
        }
    }
}