const {
    label,
    fontSize,
    fontName,
    wordWrap,
    maxWidth,
    maxHeight,
    gutterSpaces
} = that;

assert(maxWidth, `[${tags.system}] [@truncateLabel] maxWidth parameter is required.`);
assert(maxHeight, `[${tags.system}] [@truncateLabel] maxHeight parameter is required.`);
assert(gutterSpaces >= 0, `[${tags.system}] [@truncateLabel] gutterSpaces parameter must be a non-negative number.`);

if (tags.debug) {
    console.log(`[${tags.system}] ==== truncate label start ====`);
    console.log(`[${tags.system}] that:`, that);
    console.log(`[${tags.system}] label: '${label}'`);
    console.log(`[${tags.system}] label length:`, label.length);
}

if (!wordWrap) {
    const originalSize = thisBot.calculateLabelSize(that);

    if (originalSize.width <= maxWidth && originalSize.height <= maxHeight) {
        return label;
    }
}

const ellipse = '...';
const ellipseSize = thisBot.calculateLabelSize({
    ...that,
    label: ellipse
});

const gutter = ' '.repeat(gutterSpaces);
const gutterSize = thisBot.calculateLabelSize({
    ...that,
    label: gutter
});

if (wordWrap) {
    // 1. Word wrap the incoming label.
    const lines = [];

    // Split the string by white spaces, new lines, and words
    let parts = label.split(/(\s|\n|\w+)/);
    // Filter out empty strings resulting from split
    parts = parts.filter(part => part !== '');
    // Remove the gutter characters at both the start and end of the label.
    if (gutterSpaces > 0) {
        parts.splice(0, gutterSpaces);
        parts.splice(-gutterSpaces);
    }

    if (tags.debug) {
        console.log(`[${tags.system}] parts:`, parts);
    }

    let workingLine;
    let workingLineWidth;

    const pushAndStartWorkingLine = () => {
        // Insert working line into lines and start new line.
        if (workingLine != undefined) {
            if (tags.debug) {
                console.log(`[${tags.system}] pushing line: '${gutter + workingLine + gutter}'`);
            }
            lines.push(gutter + workingLine + gutter);
        }

        workingLine = '';
        workingLineWidth = gutterSize.width * 2;
    }

    pushAndStartWorkingLine();

    for (let part of parts) {
        if (tags.debug) {
            console.log(`[${tags.system}] part: '${part}'`);
        }

        if (part === '\n') {
            if (tags.debug) {
                console.log(`[${tags.system}] break new line`);
            }
            pushAndStartWorkingLine();
        } else {
            const partSize = thisBot.calculateLabelSize({
                ...that,
                label: part
            });

            let potentialWidth = workingLineWidth + partSize.width;

            if (potentialWidth > maxWidth) {
                if (part === ' ') {
                    // If a space is causing the new line, do not move it the next line.
                    if (tags.debug) {
                        console.log(`[${tags.system}] break space`);
                    }
                    pushAndStartWorkingLine();
                } else {
                    let partLineWidth = partSize.width + (gutterSize.width * 2);
                    if (partLineWidth > maxWidth) {
                        // The part is too long to fit on one line. 
                        // We need to break the part and move the rest to the next line.
                        if (tags.debug) {
                            console.log(`[${tags.system}] break part`);
                        }

                        for (let i = 0; i < part.length; i++) {
                            const char = part[i];
                            const charSize = thisBot.calculateLabelSize({
                                ...that,
                                label: char
                            });
                            
                            potentialWidth = workingLineWidth + charSize.width;

                            if (potentialWidth > maxWidth) {
                                // Need to split the part here. Push the working line and continue processing this part
                                // on the next working line.
                                if (tags.debug) {
                                    console.log(`[${tags.system}] split part`);
                                }
                                pushAndStartWorkingLine();
                                workingLine += char;
                                workingLineWidth += charSize.width;
                            } else {
                                workingLine += char;
                                workingLineWidth = potentialWidth;
                            }
                        }

                    } else {
                        if (tags.debug) {
                            console.log(`[${tags.system}] break word`);
                        }
                        pushAndStartWorkingLine();
                        workingLine += part;
                        workingLineWidth += partSize.width;
                    }
                }
            } else {
                // Part fits on line.
                workingLine += part;
                workingLineWidth += partSize.width;
            }
        }
    }

    // After processing all the parts, if there is anything left in the workingLine add it to lines.
    pushAndStartWorkingLine();

    if (tags.debug) {
        console.log(`[${tags.system}] lines:`, lines);
    }

    function linesToLabel(lines) {
        let label = '';
        for (let i = 0; i < lines.length; i++) {
            label += lines[i];

            if (i !== lines.length - 1) {
                label += '\n';
            }
        }

        return label;
    }

    let wrappedLabel = linesToLabel(lines);

    const wrappedLabelSize = thisBot.calculateLabelSize({
        ...that,
        label: wrappedLabel
    });

    if (wrappedLabelSize.height > maxHeight) {
        // If the wrapped label is too tall, then we need to truncate it.
        // Remove lines until it fits.

        // Get font data.
        const fontDataTag = `${fontName}Data`;
        const fontData = thisBot.tags[fontDataTag];

        // Calculate the number of lines to remove in order for to fit it inside the maxHeight of the container.
        const lineHeight = fontData.common.lineHeight * fontSize * 0.01;
        const totalHeight = lineHeight * lines.length;
        const linesToRemove = Math.ceil((totalHeight - maxHeight) / lineHeight);

        // Remove the lines and truncate the first line with an ellipse.
        const truncatedLines = lines.slice(linesToRemove);
        truncatedLines[0] = gutter + ellipse + truncatedLines[0].substring(gutter.length + ellipse.length);
        const truncatedLabel = linesToLabel(truncatedLines);

        return truncatedLabel;
    } else {
        // Wrapped label fits in the container.
        return wrappedLabel;
    }
} else {
    let truncatedLabel = gutter + ellipse;
    let truncatedWidth = gutterSize.width + ellipseSize.width;
    let truncatedHeight = Math.max(gutterSize.height, ellipseSize.height);

    for (let i = label.length - 1; i >= 0; i--) {
        const char = label.charAt(i);
        const charSize = thisBot.calculateLabelSize({
            ...that,
            label: char
        });

        const newWidth = truncatedWidth + charSize.width;
        const newHeight = Math.max(truncatedHeight, charSize.height);

        if (newWidth <= maxWidth && newHeight <= maxHeight) {
            truncatedWidth = newWidth;
            truncatedHeight = newHeight;
            truncatedLabel = truncatedLabel.slice(0, gutter.length + ellipse.length) + char + truncatedLabel.slice(gutter.length + ellipse.length);
        } else {
            break;
        }
    }

    return truncatedLabel;
}