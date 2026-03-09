if (that?.bot?.tags?.soundCreate) {
    thisBot.abPlaySound({
        value: that?.bot?.tags?.soundCreate,
        defaultValue: tags.defaultCreateSound
    });
}