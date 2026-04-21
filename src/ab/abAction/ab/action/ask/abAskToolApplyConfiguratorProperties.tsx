const group: string = that?.args?.group;
const values: Record<string, any> = that?.args?.values;

if (!group || !values || typeof values !== 'object') {
    return { success: false, errorMessage: `missing required args: group='${group}', values must be an object` };
}

try {
    const configuratorData: ABConfiguratorData = await ab.links.configurator.abCollectConfiguratorData({ abConfiguratorGroup: group });

    if (!configuratorData) {
        return { success: false, group, errorMessage: `no configurator found for group '${group}'` };
    }

    function overlayValues(properties: ABConfiguratorProperty[]) {
        for (const prop of properties) {
            if (prop.type === 'group') {
                overlayValues(prop.properties);
            } else if (prop.key in values) {
                prop.value = values[prop.key];
            }
        }
    }
    overlayValues(configuratorData.properties);

    await ab.links.configurator.abApplyConfiguratorProperties({
        abConfiguratorGroup: group,
        properties: configuratorData.properties,
    });

    return { success: true, group };
} catch (e) {
    return { success: false, group, errorMessage: ab.links.utils.getErrorMessage(e) };
}
