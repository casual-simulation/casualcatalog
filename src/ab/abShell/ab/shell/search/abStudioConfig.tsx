const { studioId } = that;

if (!studioId) {
    return null;
}

const cacheKey = 'abStudioConfig_' + studioId;

if (masks[cacheKey]) {
    return masks[cacheKey];
}

if (!configBot.tags.user_studios) {
    await ab.abRefreshStudios();
}

const res = await os.getData(studioId, 'abStudioConfig');
const data = res.success ? res.data : {};

const studio = configBot.tags.user_studios?.studios?.find(s => s.studioId === studioId);

const result = {
    studioId,
    studioDisplayName: studio?.displayName,
    ...data,
};

setTagMask(thisBot, cacheKey, '🧬' + JSON.stringify(result), 'tempLocal');

return result;
