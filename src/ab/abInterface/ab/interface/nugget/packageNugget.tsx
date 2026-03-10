const targetBot = getBot("id", that.bot);
const tagText = targetBot.raw[that.tag];

if (configBot.tags.cursorStartIndex || configBot.tags.cursorEndIndex)
{
    let startPos = configBot.tags.cursorStartIndex;
    let endPos = configBot.tags.cursorEndIndex;

    if (startPos == endPos)
    {
        return;
    }
    else if (startPos > endPos)
    {
        let newStartPos = endPos;
        let newEndPos = startPos;

        startPos = newStartPos;
        endPos = newEndPos;
    }

    let data = tagText.substring(startPos, endPos + 1);

    shout("abPublishNugget", {nug: that.nugget, data: data});

    os.toast("nug is publishing", 10);

    let targetNug = ".nug {" + that.nugget + "}"; 
    let nugPos = targetBot.raw[that.tag].indexOf(targetNug);

    deleteTagText(targetBot, that.tag, nugPos, targetNug.length);
}
else
{
    os.toast("cannot read nugget to be published")
}