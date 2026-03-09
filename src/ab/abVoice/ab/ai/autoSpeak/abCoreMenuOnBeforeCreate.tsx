if (!tags.autoSpeak) {
    tags.abCoreMenuLabel = "unmute " + abPersonality.tags.abBuilderIdentity;
    tags.abCoreMenuIcon = 'mic_off';
} else {
    tags.abCoreMenuLabel = "mute " + abPersonality.tags.abBuilderIdentity;
    tags.abCoreMenuIcon = 'mic';
}