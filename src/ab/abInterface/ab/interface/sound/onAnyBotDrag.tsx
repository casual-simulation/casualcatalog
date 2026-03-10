if (that?.bot?.tags?.soundDrag) {
    thisBot.abPlaySound({
        value: that?.bot?.tags?.soundDrag,
        defaultValue: tags.defaultDragSound
    });
}