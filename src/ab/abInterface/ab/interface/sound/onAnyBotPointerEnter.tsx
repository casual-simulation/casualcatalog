if (that?.bot?.tags?.soundPointerEnter) {
    thisBot.abPlaySound({
        value: that?.bot?.tags?.soundPointerEnter,
        defaultValue: tags.defaultPointerEnterSound
    });
}