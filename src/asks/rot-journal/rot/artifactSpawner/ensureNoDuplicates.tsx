let landmark = getBots(byTag("#system", "rot.artifacts.artifact"))

// creates a set to track what we've seen and not seen
const seen = new Set();
const nonUniquelandmark = landmark.filter(obj => {
    // initalizes a key for each unique object
    const key = obj?.tags?.Landmark?.data?.attributes
        ? JSON.stringify({
            Name: obj.tags.Landmark.data.attributes.Name,
            Latitude: obj.tags.Landmark.data.attributes.Latitude,
            Longitude: obj.tags.Landmark.data.attributes.Longitude
        })
        : obj?.id; // Fall back to unique ID if attributes are missing
    // if the object already exists keep in the array
    if (seen.has(key)) return true;
    seen.add(key);
    // if it's new don't keep it
    return false;
});

// destroy all duplicate landmarks and abXPBots related
nonUniquelandmark.push(...getBots("#system", "ab.pattern.abXPBot"))
destroy(nonUniquelandmark)