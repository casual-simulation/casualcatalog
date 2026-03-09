if (configBot) {
    return configBot.raw['touch_0'] === null || !!configBot.raw['touch_0']   
} else {
    return undefined;
}