let pIds = thisBot.vars.particleIds ?? [];

for (const entry of pIds) {
    destroy(entry.id);
}

thisBot.vars.particleElapsed = 0;
thisBot.vars.particleBurstTimer = 0;