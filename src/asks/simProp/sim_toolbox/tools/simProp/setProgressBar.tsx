if (tags.trackedStat) {
    if (tags.simAttributes && (tags.simAttributes[tags.trackedStat] || tags.simAttributes[tags.trackedStat] == 0)) {
        tags.progressBarBackgroundColor = 'black';
        tags.progressBarColor = 'white';
        const currentValue = tags.simAttributes[tags.trackedStat];
        let progressBarValue;
        if (tags.trackedStatStartingValue > tags.trackedStatEndingValue) {
            progressBarValue = currentValue / tags.trackedStatStartingValue;
        } else {
            progressBarValue = currentValue / tags.trackedStatEndingValue;
        }
        tags.progressBar = progressBarValue;
        console.log("prog", progressBarValue, tags.trackedStatStartingValue, tags.trackedStatEndingValue, currentValue);
    }
}