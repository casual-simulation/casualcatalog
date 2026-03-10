const askID = that?.askID;
const currentHash = that?.currentHash;
const hashAlgorithm = that?.hashAlgorithm ?? 'sha1';
const hashFormat = that?.hashFormat ?? 'hex';

assert(typeof askID === 'string', `[${tags.system}.${tagName}] askID is a required string parameter.`);
assert(typeof currentHash === 'string', `[${tags.system}.${tagName}] currentHash is a required string parameter.`)

const askData = await ab.links.search.onLookupAskID({ askID, showIndicator: false, dataOnly: true, sourceEvent: 'ask_update_check' });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] askData:`, askData);
}

if (askData.success) {
    if (askData.data.patternID && askData.data.studioID) {
        // Ask is a pointer to an egg in a studio.
        try {
            const abData = await ab.links.search.onLookupABEggs({ abID: askData.data.patternID, recordKey: askData.data.studioID, returnType: 'data'});
            const latestHash = crypto.hash(hashAlgorithm, hashFormat, abData.state);

            return { 
                success: true,
                updateAvailable: currentHash !== latestHash,
                currentHash,
                latestHash,
            }
        } catch (e) {
            console.error(`[${tags.system}.${tagName}] Caught an error.`, e);
            return { success: false }
        }
    }  else if (askData.data.version === 1 && askData.data.state) {
        // Ask is a v1 aux file.
        const latestHash = crypto.hash(hashAlgorithm, hashFormat, askData.data.state);

        return { 
            success: true,
            updateAvailable: currentHash !== latestHash,
            currentHash,
            latestHash,
        }
    } else {
        console.error(`[${tags.system}.${tagName}] Unrecognized askData structure.`, askData);
        return { success: false }
    }
} else {
    return { success: false }
}
