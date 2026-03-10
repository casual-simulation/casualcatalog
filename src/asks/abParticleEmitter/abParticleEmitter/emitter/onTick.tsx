if (tags.particlePause) return;

const dt = 0.05;
let elapsed = thisBot.vars.particleElapsed + dt;
let burstTimer = thisBot.vars.particleBurstTimer + dt;
const dim = "home";

thisBot.vars.particleElapsed = elapsed;

// Parse alive particle IDs
let pIds = thisBot.vars.particleIds ?? [];

// Clean up dead particles
const aliveIds = [];
for (const entry of pIds) {
    const p = getBot("id", entry.id);
    if (p) {
        entry.age += dt;
        if (entry.age >= entry.life) {
            destroy(p);
        } else {
            // Update particle
            const t = entry.age / entry.life;
            const cs = tags.particleColorStart ?? "#ffffff";
            const ce = tags.particleColorEnd ?? "#ffffff";
            const os_ = tags.particleOpacityStart ?? 1;
            const oe = tags.particleOpacityEnd ?? 0;
            const ss = entry.scaleStart;
            const se = tags.particleScaleEnd ?? 0.02;

            // Lerp scale
            const sc = ss + (se - ss) * t;
            setTagMask(p, "scale", Math.max(0.001, sc));

            // Lerp opacity
            const op = os_ + (oe - os_) * t;
            setTagMask(p, "formOpacity", Math.max(0, Math.min(1, op)));

            // Lerp color (simple hex lerp)
            setTagMask(p, "color", lerpColor(cs, ce, t));

            // Move
            const grav = tags.particleGravity ?? 0;
            const curZ = getTag(p, dim + "Z") ?? 0;
            entry.vz = (entry.vz || 0) + grav * dt;
            setTagMask(p, dim + "X", getTag(p, dim + "X") + entry.vx * dt);
            setTagMask(p, dim + "Y", getTag(p, dim + "Y") + entry.vy * dt);
            setTagMask(p, dim + "Z", curZ + entry.vz * dt);

            aliveIds.push(entry);
        }
    }
}

// Burst emission
if (burstTimer >= (tags.particleBurstInterval ?? 0.15) && tags.particleOn) {
    burstTimer = 0;
    const rate = tags.particleRate ?? 5;
    const maxP = tags.particleMaxCount ?? 60;
    const toSpawn = Math.min(rate, maxP - aliveIds.length);

    for (let i = 0; i < toSpawn; i++) {
        const life = (tags.particleLifetime ?? 1.5) + (Math.random() - 0.5) * 2 * (tags.particleLifetimeVariance ?? 0);
        const speed = (tags.particleSpeedMin ?? 0.3) + Math.random() * ((tags.particleSpeedMax ?? 1.2) - (tags.particleSpeedMin ?? 0.3));
        const spreadRad = ((tags.particleSpread ?? 360) / 360) * Math.PI;

        // Random direction within spread cone
        const baseDx = tags.particleDirectionX ?? 0;
        const baseDy = tags.particleDirectionY ?? 0;
        const baseDz = tags.particleDirectionZ ?? 1;

        const theta = (Math.random() - 0.5) * 2 * spreadRad;
        const phi = Math.random() * Math.PI * 2;

        const sinT = Math.sin(theta);
        const vx = baseDx * speed + sinT * Math.cos(phi) * speed * 0.5;
        const vy = baseDy * speed + sinT * Math.sin(phi) * speed * 0.5;
        const vz = baseDz * speed * Math.cos(theta);

        const scStart = (tags.particleScaleStart || 0.25) + (Math.random() - 0.5) * 2 * (tags.particleScaleVariance || 0);

        const particleMod = {
            space: "tempLocal",
            [dim]: true,
            [dim + "X"]: getTag(thisBot, dim + "X") ?? 0,
            [dim + "Y"]: getTag(thisBot, dim + "Y") ?? 0,
            [dim + "Z"]: 0.1,
            form: tags.particleForm ?? "sprite",
            formAddress: tags.particleFormAddress ?? null,
            formSubtype: tags.particleFormSubtype ?? null,
            pointable: false,
            color: tags.particleColorStart ?? "#ffcc00",
            formOpacity: tags.particleOpacityStart ?? 1,
            scale: Math.max(0.001, scStart),
            _particleOwner: thisBot.id,
            orientationMode: tags.particleBillboard ? 'billboard' : null,
        };

        const np = create(particleMod);

        aliveIds.push({
            id: np.id,
            age: 0,
            life: Math.max(0.1, life),
            vx: vx,
            vy: vy,
            vz: vz,
            scaleStart: scStart
        });
    }

    // For one-shot mode, stop after first burst sequence
    if (!tags.particleLoop) {
        tags.particleOn = false;
    }
}

thisBot.vars.particleBurstTimer = burstTimer;
thisBot.vars.particleIds = aliveIds;

// Color lerp helper
function lerpColor(a, b, t) {
    t = Math.max(0, Math.min(1, t));
    const pa = parseHex(a);
    const pb = parseHex(b);
    const r = Math.round(pa.r + (pb.r - pa.r) * t);
    const g = Math.round(pa.g + (pb.g - pa.g) * t);
    const bl = Math.round(pa.b + (pb.b - pa.b) * t);
    return "#" + toHex(r) + toHex(g) + toHex(bl);
}
function parseHex(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    return { r: parseInt(hex.substr(0, 2), 16), g: parseInt(hex.substr(2, 2), 16), b: parseInt(hex.substr(4, 2), 16) };
}
function toHex(n) { const h = n.toString(16); return h.length < 2 ? "0" + h : h; }