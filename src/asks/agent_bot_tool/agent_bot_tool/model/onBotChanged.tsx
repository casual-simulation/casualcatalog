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