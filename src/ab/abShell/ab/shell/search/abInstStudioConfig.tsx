if (ab.links.utils.isInstOwnedByStudio()) {
    const studioId = configBot.tags.owner;

    if (!masks.instStudioConfig) {
        // Load studio config once and store as a shared mask tag.
        if (!configBot.tags.user_studios) {
            await ab.abRefreshStudios();
        }
        
        if (configBot.tags.user_studios?.success) {
            const ownerStudio = configBot.tags.user_studios.studios.find(s => s.studioId === studioId);
            
            if (ownerStudio) {
                const res = await os.getData(studioId, 'abStudioConfig');
                const data = res.success ? res.data : {};
                const instStudioConfig = {
                    studioId: ownerStudio.studioId,
                    studioDisplayName: ownerStudio.displayName,
                    ...data,
                };
                setTagMask(thisBot, 'instStudioConfig', '🧬' + JSON.stringify(instStudioConfig), 'shared');

                return instStudioConfig;
            }
        }
    } else {
        return masks.instStudioConfig;
    }
}

return null;