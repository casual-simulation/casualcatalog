const shard: ABArtifactShard = {
    data: {
        rainbowArc: tags.rainbowArc ?? 0,
        redBotX: tags.homeX ?? 0,
        redBotY: tags.homeY ?? 0,
    },
    dependencies: [
        { askID: 'rc-rainbow' }
    ]
}

return shard;