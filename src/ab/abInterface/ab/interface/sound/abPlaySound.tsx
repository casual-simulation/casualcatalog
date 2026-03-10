const {
    value,
    defaultValue,
} = that ?? {};

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] value:`, value, `defaultValue:`, defaultValue);
}

if (Array.isArray(value)) {
    let randomIndex = Math.floor(Math.random() * value.length)
    let randomValue = value[randomIndex];

    if (randomValue === 'true' || randomValue === 'false') {
        randomValue = Boolean(randomValue);
    }

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] randomIndex:`, randomIndex, `randomValue:`, randomValue);
    }
    
    return thisBot.abPlaySound({ value: randomValue, defaultValue });
} else if (value === true) {
    return thisBot.abPlaySound({ value: defaultValue });
} else if (typeof value === 'string') {
    if (value.startsWith('https://')) {
        return os.playSound(value);
    } else if (value.startsWith('🧬')) {
        // This happens sometimes in CasualOS for some reason. 
        // Manually parse the json from the mod string and re-run it through.
        const jsonString = value.slice('🧬'.length);
        const json = JSON.parse(jsonString);

        return thisBot.abPlaySound({ value: json, defaultValue });
    } else{
        const catalogURL = await ab.abBuildCasualCatalogURL(value);
        return os.playSound(catalogURL);
    }
} else {
    if (value != false) {
        if (defaultValue) {
            return thisBot.abPlaySound({ value: defaultValue });
        } else {
            if (value) {
                console.error(`[${tags.system}.${tagName}] value ${value} is not supported. Must be either true boolean or string.`);
            }
        }
    }
}