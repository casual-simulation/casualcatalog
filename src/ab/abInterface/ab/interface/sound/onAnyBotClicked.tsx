if (that?.bot?.tags?.soundClick) {
    thisBot.abPlaySound({
        value: that?.bot?.tags?.soundClick,
        defaultValue: tags.defaultClickSound
    });
}