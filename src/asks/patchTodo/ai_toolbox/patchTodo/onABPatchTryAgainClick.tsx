const askInput = tags.abPatchAskInput;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] askInput:`, askInput);
}

let botsFound = true;

/**
 * Validates that all bot id references in a sanitized object still exist.
 * Returns false if any UUID string value does not resolve via getBot.
 * @param obj - The sanitized object to validate.
 * @param ignoreKeys - Array of property keys to skip validation on.
 */
function validateBotReferences(obj, ignoreKeys = []) {
  if (obj == null || typeof obj !== 'object') return true;

  for (const [key, value] of Object.entries(obj)) {
    if (ignoreKeys.includes(key)) continue;

    if (typeof value === 'string' && isUUID(value)) {
      if (!getBot('id', value)) return false;
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string' && isUUID(item)) {
          if (!getBot('id', item)) return false;
        } else if (item != null && typeof item === 'object' && !Array.isArray(item)) {
          if (!validateBotReferences(item, ignoreKeys)) return false;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      if (!validateBotReferences(value, ignoreKeys)) return false;
    }
  }

  return true;
}

function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

botsFound = validateBotReferences(askInput, ['sourceId']);

if (botsFound) {
    if (tags.abPatchInvalid) {
        destroy(thisBot);
    } else {
        whisper(thisBot, 'onABPatchUndoClick');
    }

    ab.links.ask.askGPT(askInput);
} else {
    ab.links.utils.abLogAndToast(`Can't try again — bots missing from the original user request.`);
}
