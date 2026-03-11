/**
 * Recursively flattens configurator properties, extracting nested
 * properties from groups into a flat array.
 *
 * Usage:
 *
 *   const flat = thisBot.abFlattenConfiguratorProperties({ properties: data.properties });
 */

interface ABFlattenConfiguratorPropertiesArgs {
    properties: ABConfiguratorProperty[];
}

const { properties } = that as ABFlattenConfiguratorPropertiesArgs ?? {};

const result: ABConfiguratorProperty[] = [];

for (const property of properties ?? []) {
    if (property.type === 'group') {
        result.push(...thisBot.abFlattenConfiguratorProperties({ properties: property.properties ?? [] }));
    } else {
        result.push(property);
    }
}

return result;