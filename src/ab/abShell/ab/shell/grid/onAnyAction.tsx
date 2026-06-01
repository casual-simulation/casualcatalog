if (that.action?.type === 'focus_on') {
    // AB custom system shout for when os.focusOn is called.
    shout('onABFocusOn', { ...that.action });
}