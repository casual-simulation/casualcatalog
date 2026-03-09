let { 
    label,
    fontSize,
    fontName
} = that;

// Workaround for using split(' ') on text with many spaces next to each other.
if (label === '') {
    label = ' ';
}

assert(label, `[${tags.system}] [@calculateLabelSize] label parameter is required.`);
assert(typeof fontSize === 'number' && fontSize >= 0, `[${tags.system}] [@calculateLabelSize] fontSize paramter must be a positive number.`);
assert(fontName, `[${tags.system}] [@calculateLabelSize] fontName parameter is required.`);

// Get font data.
const fontDataTag = `${fontName}Data`;
const fontData = thisBot.tags[fontDataTag];

if (!fontData) {
    console.error(`[${tags.system}] No font data found for ${fontName} underneath tag ${fontDataTag}`);
    return null;
}

let totalWidth = 0;
let totalHeight = fontData.common.lineHeight;
let lineWidth = 0;

// Loop through label's characters, adding up width and height.
for (let i = 0; i < label.length; i++) {
    const charCode = label.charCodeAt(i);
    // console.log('charCode:', charCode);

    if (charCode === 10) {
        // New line
        if (lineWidth > 0 &&
            lineWidth > totalWidth
        ) {
            totalWidth = lineWidth;
        }

        lineWidth = 0;
        totalHeight += fontData.common.lineHeight;
    } else {
        let charData = fontData.chars.find(c => c.id === charCode);

        if (!charData) {
            // If character is not includes, fallback to whitespace data.
            charData = fontData.chars.find(c => c.id === 32);
        }

        if (Number.isFinite(charData.xadvance)) {
            lineWidth += charData.xadvance;
        } else {
            if (tags.debug) {
                console.warn(`[${tags.system}] [@calculateLabelSize] charCode ${charCode} does not define xadvance number property in the font data for ${fontName}`);
            }
        }
    }
}

if (lineWidth > 0 &&
    lineWidth > totalWidth
) {
    totalWidth = lineWidth;
}

// Convert width and height totals to gridPortal units.
totalWidth = totalWidth * fontSize * 0.01;
totalHeight = totalHeight * fontSize * 0.01;

if (tags.debug) {
    // console.log(`[${tags.system}] [@calculateLabelSize] calculation end debug output:`, { ...that, width: totalWidth, height: totalHeight, fontData});
}

return {
    width: totalWidth,
    height: totalHeight
}