const identifier = uuid();
const pin = math.randomInt(1000, 10000);
const ph = crypto.sha256(pin).substring(0, 4);
const qrUrl = `https://ab1.bot/?ask=eggCarton&bios=local&staticInst=${identifier}&ph=${ph}&cw=${tags.cw}`;

return {
    identifier,
    pin,
    qrUrl
};