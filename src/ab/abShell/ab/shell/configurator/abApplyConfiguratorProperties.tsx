/**
 * Applies configurator properties to all bots in a configurator group.
 *
 * Usage:
 *
 *   // Pass the data object returned by abCollectConfiguratorData
 *   thisBot.abApplyConfiguratorProperties({ data });
 *
 *   // Pass properties and group explicitly
 *   thisBot.abApplyConfiguratorProperties({
 *       abConfiguratorGroup: 'myGroup',
 *       properties: [
 *           { key: 'speed', value: 1.5 },
 *           { key: 'baseColor', value: '#ff0000' },
 *       ],
 *   });
 *
 *   // Optionally scope to specific bots
 *   thisBot.abApplyConfiguratorProperties({ data, bots: [botA, botB] });
 */

interface ABApplyConfiguratorPropertiesArg {
    /** Required if `data` is not provided. */
    abConfiguratorGroup?: string;
    /** Required if `data` is not provided. */
    properties?: ABConfiguratorProperty[];
    /** Will derive group and properties from configurator data */
    data?: ABConfiguratorData;
    bots?: Bot[];
}

const { abConfiguratorGroup, bots: incomingBots, properties, data } = that as ABApplyConfiguratorPropertiesArg ?? {};

const group: string = abConfiguratorGroup ?? data?.group;
const sourceProperties: ABConfiguratorProperty[] = properties ?? data?.properties;
const flatProperties: ABConfiguratorProperty[] = thisBot.abFlattenConfiguratorProperties({ properties: sourceProperties });

assert(group, `[${tags.system}.${tagName}] abConfiguratorGroup is a required parameter.`);
assert(flatProperties, `[${tags.system}.${tagName}] properties or data is a required parameter.`);

const propertyValues = {};
for (const property of flatProperties) {
    const resolvedValue = property.value !== undefined ? property.value : property.default;
    if (resolvedValue !== undefined) {
        if (property.type === 'select') {
            propertyValues[property.key] = thisBot.abResolveSelectOption({ options: property.options, value: resolvedValue });
        } else if (property.type === 'multiselect') {
            const values = Array.isArray(resolvedValue) ? resolvedValue : [resolvedValue];
            propertyValues[property.key] = values
                .map((v) => thisBot.abResolveSelectOption({ options: property.options, value: v }))
                .filter((o) => o != null);
        } else {
            propertyValues[property.key] = resolvedValue;
        }
    }
}

const bots = incomingBots ?? getBots((b) => {
    return b.tags.abConfiguratorGroup === group;
});

for (const bot of bots) {
    if (bot.tags.abConfiguratorGroup !== group) {
        continue;
    }

    let result = whisper(bot, 'onABConfiguratorPropertiesChanged', { propertyValues })[0];

    if (result instanceof Promise) {
        result = await result;
    }
}