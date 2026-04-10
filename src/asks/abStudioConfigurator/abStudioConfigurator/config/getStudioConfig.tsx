const { studioId } = that;

assert(studioId, `[${tags.system}.${tagName}] studioId is a required parameter.`);

let studioConfig;

const getStudioConfigResponse = await os.getData(studioId, 'abStudioConfig');
console.log(`[${tags.system}.${tagName}] getStudioConfigResponse:`, getStudioConfigResponse);

if (getStudioConfigResponse.success) {
    studioConfig = getStudioConfigResponse.data;
} else {
    studioConfig = {};
}

return studioConfig;