if (typeof that === 'string') {
    thisBot.abLogAndToast({
        message: that,
        toast: true,
        abLog: false,
        consoleLog: false,
    });
} else {
    thisBot.abLogAndToast({
        ...that,
        toast: true,
        abLog: false,
        consoleLog: false,
    });
}