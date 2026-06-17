"-energy"

const { tickIntervalMS, deltaTime } = that ?? {};

const dbg = (msg: string, data?: any) => {
    if (tags.debug) {
        if (data !== undefined) {
            console.log(`[${tags.system}.${tagName}] ${msg}`, data);
        } else {
            console.log(`[${tags.system}.${tagName}] ${msg}`);
        }
    }
};

// onAgentTick is shouted inst-wide by each user's executor. Only drive agents the local user owns.
if (tags.ownerId && tags.ownerId !== authBot?.id) {
    dbg('skip tick — not owned by local user', { ownerId: tags.ownerId });
    return;
}

if (!links.todoBot || tags.todoInProgress || masks.moving) {
    dbg('skip tick', {
        hasTodoBot: !!links.todoBot,
        todoInProgress: tags.todoInProgress,
        moving: masks.moving,
    });
    return;
}

// Stay parked while the parent todo is paused on an askUser clarification chain.
// Without this, an executor change (e.g. page reload) clears todoInProgress via
// onABTodoExecutorChanged and we'd re-fire agentOnRequest, duplicating the questions.
// The manager triggers the actual resume by re-assigning the todo once the user answers.
if (links.todoBot.tags.awaitingUserResponse === true) {
    dbg('skip tick — awaitingUserResponse', { todoBotId: links.todoBot.id });
    return;
}

const todoBot = links.todoBot;
const dim = todoBot.tags.dimension;

const todoX = todoBot.tags[dim + 'X'] ?? 0;
const todoY = todoBot.tags[dim + 'Y'] ?? 0;

const agentX = tags[dim + 'X'] ?? 0;
const agentY = tags[dim + 'Y'] ?? 0;

const targetDist = tags.targetDistance ?? 2;

// Pick (and cache) an open standing tile adjacent to the todo bot so the agent
// doesn't end up standing on top of neighbouring todo bots. Computed once per todo
// assignment (assignTodo clears standX/standY), then we commit to that fixed tile —
// recomputing each tick would make the target jump as occupancy changes while moving.
let standX = tags.standX;
let standY = tags.standY;
if (standX == null || standY == null) {
    const open = await ab.links.utils.findOpenPositionAround({
        center: new Vector2(todoX, todoY),
        dimension: dim,
        innerRadius: Math.max(0, targetDist - 1),
        radius: targetDist + 3,
        spacing: 1,
        direction: 'outward',
        // Bias the search toward the side we're approaching from for a natural shortest path.
        preferToward: new Vector2(agentX, agentY),
    });

    if (open) {
        standX = open.x;
        standY = open.y;
    } else {
        // No open tile found nearby — fall back to a point targetDist away along the
        // direction from the todo toward the agent's current position (+x if on top).
        const fdx = agentX - todoX;
        const fdy = agentY - todoY;
        const fdist = Math.sqrt(fdx * fdx + fdy * fdy);
        const fnx = fdist > 0 ? fdx / fdist : 1;
        const fny = fdist > 0 ? fdy / fdist : 0;
        standX = Math.round(todoX + fnx * targetDist);
        standY = Math.round(todoY + fny * targetDist);
    }

    tags.standX = standX;
    tags.standY = standY;
    dbg('picked standing position', { standX, standY, fellBack: !open });
}

const sdx = standX - agentX;
const sdy = standY - agentY;
const standDist = Math.sqrt(sdx * sdx + sdy * sdy);

dbg('tick', {
    tickIntervalMS,
    deltaTime,
    todoBotId: todoBot.id,
    dim,
    agent: { x: agentX, y: agentY },
    todo: { x: todoX, y: todoY },
    stand: { x: standX, y: standY },
    standDist,
    targetDist,
    hasArmBot: !!links.armBot,
});

if (standDist > 0.5) {
    // stepsPerTick = how many tiles to walk this tick at moveSpeed tiles/sec.
    // stepIntervalMS = time to wait between steps so they spread evenly across the tick.
    const stepsPerTick = Math.max(1, Math.round((tags.moveSpeed ?? 2) * tickIntervalMS / 1000));
    const stepIntervalMS = tickIntervalMS / stepsPerTick;

    dbg('moving toward standing position', { stepsPerTick, stepIntervalMS, standX, standY });

    masks.moving = true;

    for (let i = 0; i < stepsPerTick; i++) {
        // Sleep before steps 2..N so steps are evenly spaced across the tick.
        // Skipping the sleep on step 1 means the listener finishes stepIntervalMS
        // before the next tick fires, preventing overlap between ticks.
        if (i > 0) await os.sleep(stepIntervalMS);

        const curX = tags[dim + 'X'] ?? 0;
        const curY = tags[dim + 'Y'] ?? 0;

        if (curX === standX && curY === standY) {
            dbg('arrived mid-step', { step: i });
            break;
        }

        // Step one tile toward the cached standing tile, moving along the axis with the
        // greater remaining distance first.
        if (Math.abs(standX - curX) >= Math.abs(standY - curY)) {
            tags[dim + 'X'] = curX + Math.sign(standX - curX);
        } else {
            tags[dim + 'Y'] = curY + Math.sign(standY - curY);
        }
    }

    masks.moving = false;

    dbg('movement tick complete', { x: tags[dim + 'X'], y: tags[dim + 'Y'] });

    return;
}

//check for arm extended
if (!links.armBot) {
    dbg('creating arm', { dim, position: { x: todoX, y: todoY } });
    links.arm_tool.abCreateArm({
        originBot: thisBot,
        dimension: dim,
        position: {
            x: todoX,
            y: todoY,
            z: 0
        }
    })
    tags.agentArm = `🧬${JSON.stringify({ dimension: dim, position: { x: todoX, y: todoY } })}`;
    return;
}

//work on todo
dbg('starting agentOnRequest', {
    todoBotId: todoBot.id,
    promptPreview: typeof todoBot.tags.prompt === 'string'
        ? todoBot.tags.prompt.slice(0, 80)
        : todoBot.tags.prompt,
    menuType: todoBot.tags.focusMenuType ?? 'grid',
});

setTag(todoBot, 'animationState', 'processing');

const armBot = links.armBot;
const armDimension = armBot?.tags.dimension;

thisBot.agentOnRequest({
    inquiry: todoBot.tags.prompt,
    attachments: todoBot.tags.attachments,
    todoBotId: todoBot.id,
    menuType: todoBot.tags.focusMenuType ?? 'grid',
    armPosition: armBot ? {
        dimension: armDimension,
        x: armBot.tags[armDimension + 'X'],
        y: armBot.tags[armDimension + 'Y'],
    } : undefined,
});

tags.todoInProgress = true;

dbg('agentOnRequest dispatched, todoInProgress=true');