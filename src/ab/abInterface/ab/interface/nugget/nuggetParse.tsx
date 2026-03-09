const originalTagValue = that.editedBot.raw[that.editedTag];
let tagValue = originalTagValue;

if (!tagValue) 
{
    return;
}
else if (typeof tagValue !== "string") 
{
    tagValue = tagValue.toString();
}

let initialPossibleNugPos = 0;

if (initialPossibleNugPos == -1) 
{
    return;
}
else
{
    tagValue = tagValue.substring(initialPossibleNugPos);
}

let possibleNugs = originalTagValue.replace(/[^{]/g, "").length;
let totalNugBreaks = originalTagValue.replace(/[^\n]/g, "").length;
let breakLevel = 0;
let nugsToCheck = [];

for (let i = 0; i < possibleNugs; i++)
{
    let initialNugPos = tagValue.indexOf("{") + 1;
    let possibleNugEnd = tagValue.indexOf("}");
    let possibleNug = tagValue.substring(initialNugPos, possibleNugEnd);

    if (possibleNug.indexOf(" ") == -1 && /\n/g.test(possibleNug) != true && possibleNug.length > 0 && possibleNug.indexOf(":") == -1)
    {
        let nugBreaks = tagValue.substring(0, tagValue.indexOf("{"+possibleNug+"}")).replace(/[^\n]/g, "").length;
        let publishCheck = tagValue.substring(initialNugPos - 6, initialNugPos - 2);
        let nugPublish = null;

        if (publishCheck == ".nug")
        {
            nugPublish = true;
        }

        breakLevel += nugBreaks;

        nugBreaks = totalNugBreaks - (totalNugBreaks - breakLevel);
        
        //CHECK IF $ before nugget
        if (tagValue.substring(initialNugPos - 2, initialNugPos - 1) != "$")
        {
            nugsToCheck.push({nugName: possibleNug, nugStart: nugBreaks + 1, nugPublish: nugPublish});
        }
    }
    else
    {
        let nugBreaks = tagValue.substring(0, tagValue.indexOf("}")).replace(/[^\n]/g, "").length;

        breakLevel += nugBreaks;

        nugBreaks = totalNugBreaks - (totalNugBreaks - breakLevel);
    }

    tagValue = tagValue.substring(possibleNugEnd + 1);
}

thisBot.nuggetButton({ nugget: nugsToCheck, bot: that.editedBot, tag: that.editedTag, tagValue: originalTagValue});