let message;
let duration;
let logType = 'log';
let name = abPersonality.tags.abBuilderIdentity;
let toast = true;
let abLog = true;
let consoleLog = true;

if (typeof that === 'string') {
    message = that;
    duration = thisBot.estimateReadingTime({ text: that, delayTime: 1000 }) / 1000;
} else {
    message = that.message;
    duration = that.duration ?? (thisBot.estimateReadingTime({ text: that.message, delayTime: 1000 }) / 1000);
    name = that.name ?? name;
    logType = that.logType ?? logType;
    toast = that.toast ?? toast;
    abLog = that.abLog ?? abLog;
}

if (logType === 'log') {
    if (abLog) ab.log(name + ': ' + message);
    if (consoleLog) console.log(name + ': ' + message);
    if (toast) os.toast(message, duration);
} else if (logType === 'warning' || logType === 'warn') {
    if (abLog) ab.log(name + ': Warning: ' + message);
    if (consoleLog) console.warn(name + ': ' + message);
    if (toast) os.toast(`Warning: ${message}`, duration);
} else if (logType === 'error') {
    if (abLog) ab.log(name + ': Error: ' + message);
    if (consoleLog) console.error(name + ': ' + message);
    if (toast) os.toast(`Error: ${message}`, duration);
} else {
    if (abLog) ab.log(name + ': ' + message);
    if (consoleLog) console.log(name + ': ' + message);
    if (toast) os.toast(message, duration);
}