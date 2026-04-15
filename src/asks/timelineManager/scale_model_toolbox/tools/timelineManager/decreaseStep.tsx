if (tags.currentStep > 0) {
    tags.currentStep -= 1;

    shout("setDelta", {value: tags.currentStep, unit: tags.timeUnit});
}