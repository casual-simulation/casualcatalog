const getAttributes = (tagString) => {
    let attributes = {}

    let tagDone = false
    let readingAttr = true
    let attrString = ''
    let valueString = ''

    // Read through the string to assemble the attributes object
    for (var char of tagString) {
        // Skip until the tag is done
        if (!tagDone) {
            if (char == ' ') tagDone = true;
            continue;
        }

        switch (char) {
            // Ignore spaces if reading attributes
            case ' ':
                if (!readingAttr) valueString += char
                break
            // If closing ", add attribute to the object & reset variables
            case '"':
                if (valueString) {
                    attributes[attrString] = valueString
                    attrString = ''
                    valueString = ''
                    readingAttr = true
                }
                break
            // Switch to reading value with =
            case '=':
                if (readingAttr) { // Unless it's part of the value (Like in a URL)
                    readingAttr = false
                } else {
                    valueString += char
                }
                break
            // Add character to whichever string we're reading
            default:
                if (readingAttr) {
                    attrString += char
                } else {
                    valueString += char
                }
        }
    }

    return attributes
}

return getAttributes