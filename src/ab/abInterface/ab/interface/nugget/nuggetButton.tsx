let tagValue = that.tagValue;
let regex = /\n/gi;
let breakCheck;
let breakArray = [0];
//let createdButtons = [];

while (breakCheck = regex.exec(tagValue))
{
    breakArray.push(breakCheck.index);
}

let newNuggetButton = {};

newNuggetButton.space = "tempLocal";
newNuggetButton.form = "codeButton";
newNuggetButton.targetBot = that.bot.id;
newNuggetButton.targetTag = that.tag;
newNuggetButton.label = "load nugget";
newNuggetButton.nuggetReset = "@ destroy(thisBot);";
newNuggetButton[that.bot.id + "." + that.tag] = true;
newNuggetButton.nuggetManager = "🔗" + thisBot.id;
newNuggetButton.onClick = `@ links.nuggetManager.implementNugget({bot: tags.targetBot, nugget: tags.targetNugget, tag: tags.targetTag});

destroy(thisBot);`;

for (let nugs = 0; nugs < that.nugget.length; nugs++)
{
    let currentNugget = that.nugget[nugs];
    //let buttonCheck = createdButtons.indexOf(currentNugget.nugName);

    if (!currentNugget || currentNugget == undefined) //|| buttonCheck != -1
    {
        continue;
    }

    if (currentNugget.nugPublish)
    {
        newNuggetButton.onClick = `@ links.nuggetManager.packageNugget({bot: tags.targetBot, nugget: tags.targetNugget, tag: tags.targetTag});

        destroy(thisBot);`;

        newNuggetButton.label = "publish " + currentNugget.nugName + " nugget";
    }
    else
    {
        newNuggetButton.label = "load " + currentNugget.nugName + " nugget";
    }

    newNuggetButton.targetNugget = currentNugget.nugName;
    newNuggetButton[that.bot.id + "." + that.tag + "Start"] = currentNugget.nugStart;

    create(newNuggetButton);

    //createdButtons.push(currentNugget.nugName);
}

return;