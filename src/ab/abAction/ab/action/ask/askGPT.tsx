if (authBot.tags.privacyFeatures.allowAI == false) {
    const aiMessage = links.remember.tags.ai_rejection_message ?? "AI not authorized for this account";
    links.utils.abLogAndToast({ message: aiMessage });
    os.openQRCodeScanner();
    configBot.tags.abScan = true;
    configBot.tags.requestingAI = true;
    return;
}

/**
 * Sanitizes an object in place by replacing any bot objects with their ids.
 * A bot is identified by having `id`, `tags`, and `space` properties.
 * Recursively processes nested objects and arrays.
 */
function sanitizeBotReferences(obj) {
  if (obj == null || typeof obj !== 'object') return;

  for (const [key, value] of Object.entries(obj)) {
    if (isBot(value)) {
      obj[key] = value.id;
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (isBot(value[i])) {
          value[i] = value[i].id;
        } else if (value[i] != null && typeof value[i] === 'object' && !Array.isArray(value[i])) {
          sanitizeBotReferences(value[i]);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      sanitizeBotReferences(value);
    }
  }
}

function isBot(value) {
  return (
    value != null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'id' in value &&
    'tags' in value &&
    'space' in value
  );
}

sanitizeBotReferences(that);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

const originalUserInquiry = that.inquiry ?? that;
const prompt = !that.prompt ? tags.prompt_core : tags["prompt_" + that.prompt];
const abBot = that.abBot ? getBot('id', that.abBot) : links.manifestation.links.abBot; // Allow custom ab bot to be passed.
const sourceId = that.sourceId ?? uuid();
const abDimension = that.abDimension ?? ab.links.remember.tags.abActiveDimension; // Allow custom ab dimension to be passed.
const abPosition = that.abPosition ?? ab.links.remember.tags[abDimension + 'ABLastPosition']; // Allow custom ab position to be passed.
const patchBotDimension = that.abDimension ?? ab.links.remember.tags.abActiveDimension;
const patchBotPosition = { x: abPosition?.x ?? 0, y: abPosition?.y ?? 0, z: 2 };

links.utils.abLog({ message: `thinking about: "${originalUserInquiry}"` });
links.manifestation.abBotChat({ bot: abBot, message: `thinking about: "${originalUserInquiry}"` });

let inquiry = `INPUT: ${originalUserInquiry}`;

if (that.prompt == "grid") {
    inquiry += `\nPOSITION: { dimension: "${that.data.dimension}", x: ${that.data.dimensionX}, y: ${that.data.dimensionY} }`;

} else if (that.prompt == "bot") {
    const targetBot = { id: that.data.bot, dimension: abDimension };
    inquiry += `\nTARGET_BOT: ${JSON.stringify(targetBot, undefined, 2)}`;

} else if (that.prompt == "multipleBot") {
    const targetBots = [];
    for (let id of that.data.bots) {
        if (id) {
            targetBots.push({ id, dimension: abDimension })
        }
    }
    inquiry += `\nTARGET_BOTS: ${JSON.stringify(targetBots, undefined, 2)}`;

} else if (that.prompt == "core") {
    inquiry += `\nTARGET_DIMENSION: ${abDimension}`;
}

// Create a bot that signals (locally) when calls to ai have begun and ended.

const response = await thisBot.submitRequestGPT({ inquiry: inquiry, prompt: prompt, model: that.model, sourceId });

if (response) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] raw submitRequestGPT response:\n`, response);
    }

    /**
     * Extracts code content from an LLM response, stripping markdown
     * code fences and language tags if present. If no fenced code block
     * is found, returns the trimmed response as-is.
     */
    function extractCode(response) {
      const match = response.match(/```(?:\w*)\s*\n([\s\S]*?)```/);
      return match ? match[1].trim() : response.trim();
    }

    let extractedCode = extractCode(response);
    
    links.utils.abLog({ message: `[generated code]:\n${extractedCode}` });

    const eggParameters = {
        patchCode: extractedCode,
        askInput: that,
        dimension: patchBotDimension,
        position: patchBotPosition,
        alwaysApprove: false,
    }

    const patchBotTemplate = getBot(b => b.tags.abPatchBot && !b.tags.abPatchBotIntance && !b.tags.abIgnore);
    
    if (patchBotTemplate) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] cloning patch bot ${patchBotTemplate.id} from template bot that was found`);
        }

        const botData = getSnapshot(patchBotTemplate);
        await ab.links.create.abCreateBots({
            botData,
            eggParameters,
            sourceEvent: 'ask_gpt',
        })
    } else {
        await ab.links.search.onLookupAskID({
            askID: 'abPatchBot',
            showIndicator: false,
            autoHatch: true,
            eggParameters,
            sourceEvent: 'ask_gpt',
            ignoreReserved: true,
        })
    }
}