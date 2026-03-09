let { 
    bot,
    dimension,
    preserveNewLines = true,
    label = '',
    space = 'tempLocal',
    color = 'white',
    labelColor = 'black',
    ...rest
} = that ?? {};

if (typeof label !== 'string') {
    label = String(label);
}

assert(links.utils.isBot(bot), `[${tags.system}.${tagName}] bot is a required Bot parameter.`);
assert(dimension, `[${tags.system}.${tagName}] dimension is a required parameter.`);
assert(rest.onCreate == null, `[${tags.system}.${tagName}] onCreate is a reserved tag.`);
assert(rest.onAnyBotsChanged == null, `[${tags.system}.${tagName}] onCreate is a reserved tag.`);
assert(rest.onAnyBotsRemoved == null, `[${tags.system}.${tagName}] onCreate is a reserved tag.`);
assert(rest.updateLabel == null, `[${tags.system}.${tagName}] onCreate is a reserved tag.`);
assert(rest.labelWordWrapMode == null, `[${tags.system}.${tagName}] labelWordWrapMode is a reserved tag.`);

// --- 1) Word breaking (wrap by words, chunk long words) ---
function breakWordsToLines(text, maxCols = 18) {
    if (!text) return [''];
    const words = text.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';

    const push = () => { lines.push(line); line = ''; };

    for (const w of words) {
        if (w.length > maxCols) {
            // close current line (if any) before chunking a long word
            if (line) push();
            // chunk the long word
            for (let i = 0; i < w.length; i += maxCols) {
                lines.push(w.slice(i, i + maxCols));
            }
            line = '';
            continue;
        }
        if (!line.length) {
            line = w;
        } else if (line.length + 1 + w.length <= maxCols) {
            line += ' ' + w;
        } else {
            push();
            line = w;
        }
    }
    if (line.length) push();

    return lines.length ? lines : [''];
}

// Preserves existing \n as hard breaks; wraps within each hard line.
function breakWordsToLinesPreserveNewlines(text, maxCols = 18) {
  if (text == null) return [''];

  // Split on real newlines; keep empty lines so we preserve blank lines.
  const hardLines = String(text).split(/\r?\n/);
  const out = [];

  // Helper to wrap a single hard line by words (with long-word chunking)
  const wrapOne = (src) => {
    // Normalize tabs -> spaces; collapse internal whitespace (not newlines)
    const s = src.replace(/\t/g, '    ').replace(/\s+/g, ' ').trim();
    if (!s.length) { out.push(''); return; }

    const words = s.split(' ');
    let line = '';

    const pushLine = () => { out.push(line); line = ''; };

    // chunk long words to emulate 'breakWords'
    const chunkWord = (w) => {
      for (let i = 0; i < w.length; i += maxCols) {
        const chunk = w.slice(i, i + maxCols);
        if (!line.length) line = chunk;
        else { pushLine(); line = chunk; }
      }
    };

    for (const w of words) {
      if (w.length > maxCols) {
        if (line.length) pushLine();
        chunkWord(w);
        continue;
      }
      if (!line.length) {
        line = w;
      } else if (line.length + 1 + w.length <= maxCols) {
        line += ' ' + w;
      } else {
        pushLine();
        line = w;
      }
    }
    if (line.length) pushLine();
  };

  for (const hl of hardLines) {
    wrapOne(hl);           // wrap within this hard line
  }

  // If the input ended with a trailing newline, we already preserved it
  // because split kept an empty last item -> became an empty wrapped line.
  return out.length ? out : [''];
}

// --- 2) Simple sizing from lines ---
// Think of "colsPerScaleX" as "about N characters per 1 scaleX".
function computeSimpleScalesFromLines(lines, {
    colsPerScaleX = 2.5,
    minScaleX = 1.25,
    maxScaleX = 10,
    baseScaleY = 1.2,
    perLineY = 0.75,
} = {}) {
    const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
    const lineCount = Math.max(1, lines.length);

    // Width scales with the longest line length
    let scaleX = longest > 0 ? (longest / colsPerScaleX) : minScaleX;
    scaleX = Math.max(minScaleX, Math.min(maxScaleX, scaleX));

    // Height grows per line; keep it simple and predictable
    const scaleY = Math.max(baseScaleY, baseScaleY + (lineCount - 1) * perLineY);

    return { scaleX, scaleY, longest, lineCount };
}


// Pick your target "columns" per line (tweak to taste)
const MAX_COLS = 32;

// Break the text yourself
const lines = preserveNewLines ? breakWordsToLinesPreserveNewlines(label, MAX_COLS) : breakWordsToLines(label, MAX_COLS);
const wrappedLabel = lines.join('\n');

// Compute simple scales from the wrapped text
const { scaleX, scaleY } = computeSimpleScalesFromLines(lines);

let labelMod = {
    space: space,
    trackBotId: bot.id,
    form: 'sprite',
    color,
    label: wrappedLabel,
    labelColor,
    labelSize: 1,
    labelPaddingX: 0.5,
    labelWordWrapMode: 'none',
    scaleX, 
    scaleY,
    scaleZ: 0.1,
    botLabelMargin: 1,
    anchorPoint: '➡️0,-0.5,0',
    orientationMode: 'billboard',
    dimension: dimension,
    debug: false,
    [dimension]: true,
    pointable: false,
    onCreate: `@
        // Wait for required bots to be ready.
        let waitTime = 0;

        while(!globalThis.ab) {
            if (waitTime >= 5000) {
                return;
            }
            
            await os.sleep(250);
            waitTime += 250;
        }

        tags.ready = true;
        thisBot.updateLabel();
    `,
    onAnyBotsChanged: `@
        for (const changed of that) {
            if (changed.bot && changed.bot.id === tags.trackBotId) {
                const onlyRotationTags = changed.tags.every((t) => {
                    return t.endsWith('Rotation') || t.endsWith('RotationX') || t.endsWith('RotationY') || t.endsWith('RotationZ')
                })

                if (tags.debug) {
                    console.log('[abBillboardLabel] onlyRotationTags:', onlyRotationTags);
                }

                if (onlyRotationTags) {
                    return;
                }

                thisBot.updateLabel();
                return;
            }
        }
    `,
    onAnyBotsRemoved: `@

        if (that.botIDs.includes(tags.trackBotId)) {
            destroy(thisBot);
        }
    `,
    onPortalChanged: `@
        if (that.dimension === tags.dimension) {
            thisBot.updateLabel();
        }
    `,
    updateLabel: `@
        if (!tags.ready) {
            console.log('[abBillboardLabel] ignoring updateLabel because not ready');
        }

        const hasLabel = tags.label != null && tags.label !== '';
        tags[tags.dimension] = hasLabel;

        if (!hasLabel) {
            if (tags.debug) {
                console.log('[abBillboardLabel] ignore updateLabel call, there is no label tag value to display.');
            }

            return;
        }

        const inMapPortal = (configBot.tags.mapPortal && configBot.tags.mapPortal === tags.dimension) ||
                            (configBot.tags.miniMapPortal && configBot.tags.miniMapPortal === tags.dimension);
                          
        const inGridPortal = (configBot.tags.gridPortal && configBot.tags.gridPortal === tags.dimension) ||
                             (configBot.tags.miniGridPortal && configBot.tags.miniGridPortal === tags.dimension);

        if (!inMapPortal && !inGridPortal) {
            if (tags.debug) {
                console.log('[abBillboardLabel] ignore updateLabel call, not in either grid or map portal.');
            }

            return;
        }
        
        const trackBot = getBot('id', tags.trackBotId);
        const trackPosition = getBotPosition(trackBot, tags.dimension);

        if (tags.debug) {
            console.log('[abBillboardLabel] trackPosition:', trackPosition);
        }

        let labelPosition = { x: trackPosition.x, y: trackPosition.y, z: trackPosition.z }; 

        const trackBotScale = trackBot.tags.scale ?? 1;
        const trackBotScaleZ = trackBot.tags.scaleZ ?? 1;

        let metersPerGridUnit = 1;

        if (inMapPortal) {
            // Scale to map portal units.
            metersPerGridUnit = 10;
        }

        let trackBotRealScaleZ = (trackBotScaleZ * trackBotScale) * metersPerGridUnit;

        if (tags.debug) {
            console.log('[abBillboardLabel] trackBotRealScaleZ:', trackBotRealScaleZ);
        }

        labelPosition.z += trackBotRealScaleZ + (tags.botLabelMargin * metersPerGridUnit);

        if (tags.debug) {
            console.log('[abBillboardLabel] labelPosition:', labelPosition);
        }

        tags[tags.dimension + 'X'] = labelPosition.x;
        tags[tags.dimension + 'Y'] = labelPosition.y;
        tags[tags.dimension + 'Z'] = labelPosition.z;
    `
};

labelMod = {
    ...labelMod,
    ...rest,
}

const labelBot = create(labelMod);

return labelBot;