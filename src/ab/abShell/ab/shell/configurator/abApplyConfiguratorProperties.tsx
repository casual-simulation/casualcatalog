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

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] incoming source properties for group '${group}':`, self.structuredClone(sourceProperties));
}

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
        } else if (property.type === 'list') {
            propertyValues[property.key] = Array.isArray(resolvedValue) ? resolvedValue : [resolvedValue];
        } else {
            propertyValues[property.key] = resolvedValue;
        }
    }
}

let bots;

if (incomingBots) {
    bots = incomingBots.filter((b) => b.tags.abConfiguratorGroup === group);
} else {
    bots = getBots((b) => {
        return b.tags.abConfiguratorGroup === group;
    });
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] applying property values for '${group}' to bots: ${bots.map((b) => b.id).join(', ')}`, self.structuredClone(propertyValues));
}

for (const bot of bots) {
    let result = whisper(bot, 'onABConfiguratorPropertiesChanged', { propertyValues })[0];

    if (result instanceof Promise) {
        result = await result;
    }
}