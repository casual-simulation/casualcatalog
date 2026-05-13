let message;
let duration;
let logType = 'log';
let name = abPersonality.tags.abBuilderIdentity;
let avatar;
let toast = true;
let abLog = true;
let consoleLog = true;
let space = "tempLocal";

if (typeof that === 'string') {
    message = that;
    duration = thisBot.estimateReadingTime({ text: that, delayTime: 1000 }) / 1000;
} else {
    message = that.message;
    duration = that.duration ?? (thisBot.estimateReadingTime({ text: that.message, delayTime: 1000 }) / 1000);
    name = that.name ?? name;
    avatar = that.avatar;
    logType = that.logType ?? logType;
    toast = that.toast ?? toast;
    abLog = that.abLog ?? abLog;
    space = that.space ?? space;
}

if (!avatar && name === abPersonality.tags.abBuilderIdentity) {
    avatar = abPersonality.tags.abBuilderAvatar;
}

if (logType === 'log') {
    if (abLog) ab.log({ name, avatar, message, space });
    if (consoleLog) console.log(name + ': ' + message);
    if (toast) os.toast(message, duration);
} else if (logType === 'warning' || logType === 'warn') {
    if (abLog) ab.log({ name, avatar, message: 'Warning: ' + message, space });
    if (consoleLog) console.warn(name + ': ' + message);
    if (toast) os.toast(`Warning: ${message}`, duration);
} else if (logType === 'error') {
    if (abLog) ab.log({ name, avatar, message: 'Error: ' + message, space });
    if (consoleLog) console.error(name + ': ' + message);
    if (toast) os.toast(`Error: ${message}`, duration);
} else {
    if (abLog) ab.log({ name, avatar, message, space });
    if (consoleLog) console.log(name + ': ' + message);
    if (toast) os.toast(message, duration);
}