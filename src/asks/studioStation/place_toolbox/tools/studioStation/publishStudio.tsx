const record = await os.recordData(tags.studioId, 'homeworldMetaData', {
    position: {
        x: tags.homeX,
        y: tags.homeY
    }
});

if (!record.success) {
    console.log(`[${tags.system}.${tagName}] requesting inst admin permission for studio ${tags.studioId}.`);
    await os.grantInstAdminPermission(tags.studioId);

    await os.recordData(tags.studioId, 'homeworldMetaData', {
        position: {
            x: tags.homeX,
            y: tags.homeY
        }
    });
}