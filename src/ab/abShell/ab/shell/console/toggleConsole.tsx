if (masks.open) {
    whisper(thisBot, "hideConsole");
    setTagMask(thisBot, 'open', false, 'local');
} else {
    whisper(thisBot, "showConsole");
    setTagMask(thisBot, 'open', true, 'local');
}