let tempTileProperties = tags.tileProperties;
let thatForm = Array.isArray(that) ? "array" : "object";

if (tempTileProperties && that) {
    if (Array.isArray(that)) {
        for(const entry of that){
            tempTileProperties[entry.property] = entry.value;
        }
    }
    else {
        tempTileProperties[that.property] = that.value;
    }

    setTagMask(thisBot, "tileProperties", tempTileProperties, "shared");
}