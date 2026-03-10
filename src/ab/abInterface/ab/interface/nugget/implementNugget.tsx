let nuggetName = that.nugget;
let nuggetVersionCheck = nuggetName.indexOf(".v");
let version;

if (nuggetVersionCheck != -1)
{
    nuggetName = nuggetName.substring(0, nuggetVersionCheck);

    let versionCheck = that.nugget.substring(nuggetVersionCheck + 2);

    if (isNaN(versionCheck))
    {
        console.log(versionCheck, "version is not a number");
    }
    else
    {
        version = Number(versionCheck);
    }
}
console.log(nuggetName, version);
let nugData = await thisBot.abLoadNugget({nuggetName: nuggetName, version: version});

if (nugData == "abID not found")
{
    os.toast("nugget not found");
}
else
{
    let targetBot = getBot("id", that.bot);
    let targetTag = targetBot.raw[that.tag].toString();
    let targetNug = "{" + that.nugget + "}"; 
    let nugPos = targetTag.indexOf(targetNug);

    deleteTagText(targetBot, that.tag, nugPos, targetNug.length);
    insertTagText(targetBot, that.tag, nugPos, nugData);
}