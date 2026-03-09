//shout("abMenuRefresh");

configBot.masks.menuPortal = "abPatternMenu";

links.menu.masks.onGridClick = "@ shout('abMenuRefresh'); links.manifestation.abClick();";

const allBots = getBots("abIDOrigin");
const allPatterns = ["new pattern"];

botLoop:
for (let i = 0; i < allBots.length; i++)
{
    const activeBot = allBots[i];

    if (activeBot.tags.abIgnore)
    {
        continue botLoop;
    }

    const possiblePattern = activeBot.tags.abIDOrigin;

    for (let j = 0; j < allPatterns.length; j++)
    {
        const activePattern = allPatterns[j];

        if (activePattern == possiblePattern )
        {
            continue botLoop;
        }
        else if (j == allPatterns.length - 1)
        {
            allPatterns.push(possiblePattern);
        }
    }
}

const targetAB = links.remember.tags.baseAB;
const menuButton = {};

menuButton.abPatternMenu = true;
menuButton.abPatternMenuSortOrder = 0;
menuButton.abMenuRefresh = "@ destroy(thisBot);";
menuButton.abPatternMenuRefresh = "@ destroy(thisBot);";
menuButton.color = links.remember.tags.abBaseColor;
menuButton.manager = "🔗" + thisBot.id;
menuButton.remember = tags.remember;
menuButton.onClick = `@const totalPatternBots = getBots(b => b.tags.abIDOrigin === tags.label && b.space === 'shared' && !b.tags.abIgnore);
const nonPatternBots = getBots(b => b.tags.abIDOrigin == null && b.space === 'shared' && !b.tags.abIgnore);

shout("abSelectTitleUpdate", {ab: tags.label, abBots: totalPatternBots.length, nonABBots: nonPatternBots.length});

links.remember.masks.baseAB = tags.label == "new pattern" ? null : tags.label;

configBot.tags.selectedAB = tags.label == "new pattern" ? null : tags.label;

shout("abPatternMenuRefresh");

configBot.masks.menuPortal = "abMenu";`;

allPatterns.sort();

for (let i = 0; i < allPatterns.length; i++)
{
    let activePatternName = allPatterns[i];

    menuButton.formAddress = targetAB == activePatternName ? "radio_button_checked" : "radio_button_unchecked";
    menuButton.label = activePatternName;

    if (activePatternName == "new pattern")
    {
        menuButton.abPatternMenuSortOrder = -1;
    }
    else
    {
        menuButton.abPatternMenuSortOrder = i;
    }

    links.menu.abCreateMenuButton(menuButton);
}

if (!getBot(byMod({abPatternMenu: true, formAddress: "radio_button_checked"})))
{
    const newBot = getBot(byMod({abPatternMenu: true, label: "new pattern"}));
    
    newBot.tags.formAddress = "radio_button_checked";
}