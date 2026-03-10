if (!tags.lineTo) {
    tags.lineTo = [];
}

if (typeof(tags.lineTo) == 'string') {
    tags.lineTo = [tags.lineTo];
}

const lineToArr = [...tags.lineTo];

for (let i = 0; i < lineToArr.length; ++i) {
    let tempBot = getBot(byID(lineToArr[i]));
    if (tempBot) {
        continue;
    } else {
        tempBot = getBot("prevBotID", lineToArr[i]);
        if (tempBot) {
            lineToArr[i] = getID(tempBot);
        }
    }
}

tags.lineTo = lineToArr;