/**
 * Collects configurator properties and applies their default values.
 *
 * Usage:
 *
 *   // Apply defaults to all bots in a group
 *   thisBot.abApplyConfiguratorDefaults({ abConfiguratorGroup: 'myGroup' });
 *
 *   // Apply defaults to specific bots
 *   thisBot.abApplyConfiguratorDefaults({ abConfiguratorGroup: 'myGroup', bots: [botA, botB] });
 */

interface ABApplyConfiguratorDefaultsArg {
    abConfiguratorGroup: string;
    bots?: Bot[];
}

const { abConfiguratorGroup, bots: incomingBots } = that as ABApplyConfiguratorDefaultsArg ?? {};

assert(abConfiguratorGroup, `[${tags.system}.${tagName}] abConfiguratorGroup is a required parameter.`);

const bots = incomingBots ?? getBots((b) => {
    return b.tags.abConfiguratorGroup === abConfiguratorGroup;
});

const data = await thisBot.abCollectConfiguratorData({ abConfiguratorGroup, bots });
const flatProperties = thisBot.abFlattenConfiguratorProperties({ properties: data.properties });
for (const property of flatProperties) {
    delete property.value;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] default properties:`, flatProperties);
}

await thisBot.abApplyConfiguratorProperties({ abConfiguratorGroup, bots, properties: flatProperties });