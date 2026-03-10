let newProgressBarValue = tags.progressBar + .033;
if (newProgressBarValue >= 1) {
    newProgressBarValue = 0;
}
setTagMask(thisBot, "progressBar", newProgressBarValue, "local");