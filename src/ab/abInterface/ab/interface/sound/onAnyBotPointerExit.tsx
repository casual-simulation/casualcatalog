if (that?.bot?.tags?.soundPointerExit) {
    thisBot.abPlaySound({
        value: that?.bot?.tags?.soundPointerExit,
        defaultValue: tags.defaultPointerExitSound
    });
}