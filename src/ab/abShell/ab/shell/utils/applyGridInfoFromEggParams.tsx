const {
    bot,
    eggParameters
} = that ?? {};

if (bot && eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    bot.tags[dimension] = true;
    bot.tags[dimension + 'X'] = dimensionX;
    bot.tags[dimension + 'Y'] = dimensionY;
}
