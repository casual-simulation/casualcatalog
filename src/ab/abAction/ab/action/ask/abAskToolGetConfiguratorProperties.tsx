const group: string = that?.args?.group;

if (!group) {
    return { success: false, errorMessage: 'missing required arg: group' };
}

try {
    const configuratorData: ABConfiguratorData = await ab.links.configurator.abCollectConfiguratorData({ abConfiguratorGroup: group });

    if (!configuratorData || !configuratorData.properties?.length) {
        return { success: false, group, errorMessage: `no configurator data found for group '${group}'` };
    }

    return { success: true, group: configuratorData.group, properties: configuratorData.properties };
} catch (e) {
    return { success: false, group, errorMessage: ab.links.utils.getErrorMessage(e) };
}
