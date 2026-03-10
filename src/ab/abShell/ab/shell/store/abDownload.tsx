const possibleBots = that?.possibleBots;
let filename = that?.filename;
let sourceEvent = that?.sourceEvent;
let onPreprocessBeforeDownload = that?.onPreprocessBeforeDownload;
let log = that?.log ?? true;
let reopenAbMenu = that?.reopenAbMenu ?? true;

// Let all bots know that ab is about to download bots.
const beforeDownloadArg = { filename, sourceEvent };
await Promise.allSettled(shout('onABBeforeDownload', beforeDownloadArg));

let downloadBots;

const shouldDownloadInst = !possibleBots || (Array.isArray(possibleBots) && possibleBots.length === 0);

if (shouldDownloadInst) {
    // Download inst.
    downloadBots = getBots(b => !b.tags.abIgnore && b.space === 'shared');

    if (!filename) {
        // Generate a filename if one is not given.
        filename = `${os.getCurrentInst()}_${links.utils.abFileTimecode()}`;
    }

    if (log) {
        links.utils.abLog('download inst');
    }
} else {
    if (Array.isArray(possibleBots)) {
        // Download bots.
        downloadBots = possibleBots;
        const botIds = possibleBots.map(b => b.id).sort();
        let botIdsSHA1 = crypto.hash('sha1', 'hex', botIds);

        if (!filename) {
            // Generate a filename if one is not given.
            filename = `${os.getCurrentInst()}_${botIdsSHA1.substring(0, 7)}_${links.utils.abFileTimecode()}`;
        }

        if (log) {
            links.utils.abLog(`download ${downloadBots.length} bots`);
        }
    } else {
        // Download bot.
        downloadBots = [possibleBots];

        if (!filename) {
            // Generate a filename if one is not given.
            filename = `${os.getCurrentInst()}_${possibleBots.id.substring(0, 7)}_${links.utils.abFileTimecode()}`;
        }

        if (log) {
            links.utils.abLog('download bot');
        }
    }
}

if (!Array.isArray(downloadBots)) {
    downloadBots = [downloadBots];
}

const state = {};

// Format bots for file storage
for (let i = 0; i < downloadBots.length; i++) {
    let currentBotID = downloadBots[i].id;
    let currentBotData = JSON.parse(JSON.stringify(downloadBots[i]));

    state[currentBotID] = currentBotData;
}

if (!filename.endsWith('.aux')) {
    filename += '.aux';
}

// Do a preprocessing pass that allows listeners to preprocess the bot data before it is published.
const preprocessArg = { botData: state, filename, sourceEvent };

if (onPreprocessBeforeDownload) {
    await onPreprocessBeforeDownload(preprocessArg);
}

await Promise.allSettled(shout('onABPreprocessBeforeDownload', preprocessArg));

// Download as v1 aux file.
const auxFile = { version: 1, state };
os.download(auxFile, filename, 'application/json');

shout("abMenuRefresh");

if (reopenAbMenu) {
    links.manifestation.abClick();
}