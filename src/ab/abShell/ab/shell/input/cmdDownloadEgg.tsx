const recordKey = await os.showInput(masks.prevDownloadEggRecordKey, {
    title: 'record to lookup egg in',
    type: 'text',
})
console.log(`[${tags.system}.${tagName}] recordKey:`, recordKey);

if (!recordKey) {
    return;
}

masks.prevDownloadEggRecordKey = recordKey;

const eggName = await os.showInput(masks.prevDownloadEggName, {
    title: 'name of egg',
    type: 'text',
})
console.log(`[${tags.system}.${tagName}] eggName:`, eggName);

if (!eggName) {
    return;
}

masks.prevDownloadEggName = eggName;

const egg = await links.search.onLookupABEggs({
    abID: eggName,
    recordKey,
    returnType: 'egg'
})

console.log(`[${tags.system}.${tagName}] egg:`, egg);

if (!Array.isArray(egg.eggVersionHistory) || egg.eggVersionHistory.length === 0) {
    links.utils.abLogAndToast(`Data found at address '${eggName}' in record '${recordKey}' does not appear to be an egg.`)
    return null;
}

const eggVersionOptions = egg.eggVersionHistory.map((item, index) => {
    return { label: `version ${index + 1}`, value: index }
})

const selectedVersionOption = await os.showInput(eggVersionOptions.length - 1, {
    title: 'download egg version',
    type: 'list',
    subtype: 'select',
    items: eggVersionOptions,
})

if (!selectedVersionOption) {
    return null;
}

const auxDataUrl = egg.eggVersionHistory[selectedVersionOption.value];
const auxData = await os.getFile(auxDataUrl);
const auxFilename = `${eggName}_v${selectedVersionOption.value + 1}.aux`;

os.download(auxData, auxFilename, 'application/json');