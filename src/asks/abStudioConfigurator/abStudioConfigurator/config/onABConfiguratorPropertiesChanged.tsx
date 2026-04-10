const { propertyValues } = that;

const studioId = tags.studioId;

const studioConfig = await thisBot.getStudioConfig({ studioId });

for (let key in propertyValues) {
    studioConfig[key] = propertyValues[key];
}

console.log(`[${tags.system}.${tagName}] studioConfig to publish:`, studioConfig);

const publishRecordResult = await ab.links.store.abPublishRecord({ 
    userRecord: studioId, 
    recordName: 'abStudioConfig', 
    recordData: studioConfig, 
    publicFacing: true, 
    toast: true
});

console.log(`[${tags.system}.${tagName}] publishRecordResult:`, publishRecordResult);