const record = await os.recordData(tags.studioId, 'homeworldMetaData', {
    position: {
        x: tags.homeX,
        y: tags.homeY
    }
});

if (!record.success) {
    await os.grantInstAdminPermission(tags.studioId);

    await os.recordData(tags.studioId, 'homeworldMetaData', {
        position: {
            x: tags.homeX,
            y: tags.homeY
        }
    });
}