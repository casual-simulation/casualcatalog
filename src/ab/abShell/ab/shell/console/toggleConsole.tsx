if (masks.open) {
    whisper(thisBot, "hideConsole");
    masks.open = false;
} else {
    whisper(thisBot, "showConsole");
    masks.open = true;
}