if (typeof that === 'string') {
    thisBot.abLogAndToast({
        message: that,
        toast: false,
        abLog: true,
        consoleLog: true,
    });
} else {
    thisBot.abLogAndToast({
        ...that,
        toast: false,
        abLog: true,
        consoleLog: true,
    });
}