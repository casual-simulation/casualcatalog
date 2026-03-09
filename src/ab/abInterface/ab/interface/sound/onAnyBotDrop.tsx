if (that?.bot?.tags?.soundDrop) {
    thisBot.abPlaySound({
        value: that?.bot?.tags?.soundDrop,
        defaultValue: tags.defaultDropSound
    });
}