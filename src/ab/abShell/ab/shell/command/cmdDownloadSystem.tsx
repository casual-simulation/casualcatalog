const args = that;

if (!args || args.length === 0) {
    links.utils.abLogAndToast({ message: 'Must provide system name(s) to download.', logType: 'error' })
    return;
}

const systemNames = args;

for (const systemName of systemNames) {
    const systemNameParts = systemName.split('.');

    const systemBots = getBots((b) => {
        if (b.space === 'shared' && !b.tags.abIgnore && b.tags.system) {
            const systemTagParts = b.tags.system.split('.');
            const match = systemNameParts.every((systemNamePart, index) => systemTagParts[index] === systemNamePart);
            return match;
        }
    });

    if (systemBots && systemBots.length) {
        const filename = `${systemName}.aux`;
        ab.links.store.abDownload({ possibleBots: systemBots, filename, reopenAbMenu: false, sourceEvent: 'ab_cmd_download_system' });
    }
}