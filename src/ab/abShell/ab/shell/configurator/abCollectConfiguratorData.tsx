interface ABCollectConfiguratorDataArg {
    abConfiguratorGroup: string;
    bots?: Bot[];
}

const { abConfiguratorGroup, bots: incomingBots } = that as ABCollectConfiguratorDataArg ?? {};

assert(abConfiguratorGroup, `[${tags.system}.${tagName}] abConfiguratorGroup is a required parameter.`);

const bots = incomingBots ?? getBots((b) => {
    return b.tags.abConfiguratorGroup === abConfiguratorGroup;
});

const data: ABConfiguratorData = {
    group: abConfiguratorGroup,
    properties: [],
}

const seenKeys = new Map();

function processProperties(properties, bot) {
    const processed = [];

    for (const property of properties) {
        if (!property || !property.key) {
            continue;
        }

        if (typeof property.key === 'string' && property.key.includes('::')) {
            ab.links.utils.abLog({ message: `[${tagName}] Property key "${property.key}" from bot ${bot.id} contains the reserved "::" separator. Ignoring.`, logType: 'warning' });
            continue;
        }

        if (seenKeys.has(property.key)) {
            ab.links.utils.abLog({ message: `[${tagName}] Duplicate key "${property.key}" from bot ${bot.id} — already defined by bot ${seenKeys.get(property.key)}. Ignoring.`, logType: 'warning' });
            continue;
        }

        seenKeys.set(property.key, bot.id);

        if (property.type === 'group') {
            property.properties = processProperties(property.properties ?? [], bot);
            processed.push(property);
            continue;
        }

        const valueResult = property.value != null
            ? thisBot.abValidatePropertyValue({ property, value: property.value })
            : null;

        const defaultResult = property.default != null
            ? thisBot.abValidatePropertyValue({ property, value: property.default })
            : null;

        if (defaultResult && !defaultResult.valid) {
            ab.links.utils.abLog({
                message: `[${tagName}] Invalid default for "${property.key}" from bot ${bot.id}: ${defaultResult.reason}. Clearing default.`,
                logType: 'warning',
            });

            property.default = undefined;
        }

        if (valueResult && !valueResult.valid) {
            ab.links.utils.abLog({
                message: `[${tagName}] Invalid value for "${property.key}" from bot ${bot.id}: ${valueResult.reason}. Clearing value.`,
                logType: 'warning',
            });

            property.value = undefined;
        }

        processed.push(property);
    }

    return processed;
}

for (const bot of bots) {
    if (bot.tags.abConfiguratorGroup !== abConfiguratorGroup) {
        continue;
    }

    let results = whisper(bot, 'onABCollectConfiguratorProperties')[0];

    if (results instanceof Promise) {
        results = await results;
    }

    const properties: ABConfiguratorProperty[] = results?.flat?.() ?? [];
    data.properties.push(...processProperties(properties, bot));
}

data.properties.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

return data;