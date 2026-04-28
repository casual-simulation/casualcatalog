let record = await os.recordData(tags.studioId, 'catalogMetaData', {
    tool_array: {
        ...tags.tool_array
    },
    toolbox_array: {
        ...tags.toolbox_array
    }
});

if (!record.success) {
    await os.grantInstAdminPermission(tags.studioId);

    record = await os.recordData(tags.studioId, 'catalogMetaData', {
        tool_array: {
            ...tags.tool_array
        },
        toolbox_array: {
            ...tags.toolbox_array
        }
    });

    if (record.success) {
        os.toast("Publish successful.");
    } else {
        os.toast("Publish failed.");
    }
}