//shout("abMenuRefresh");
//TODO

configBot.masks.menuPortal = "studioCatalogPatternSelectMenu";

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

const targetAB = ab.links.remember.tags.baseAB;
const menuButton = {};

menuButton.studioCatalogPatternSelectMenu = true;
menuButton.studioCatalogPatternSelectMenuSortOrder = 0;
menuButton.abMenuRefresh = "@ destroy(thisBot);";
menuButton.studioCatalogPatternSelectMenuRefresh = "@ destroy(thisBot);";
menuButton.manager = getLink(ab.links.store);
menuButton.remember = getLink(ab.links.remember);
menuButton.onClick = `@const totalPatternBots = getBots(b => b.tags.abIDOrigin === tags.label && b.space === 'shared' && !b.tags.abIgnore);
const nonPatternBots = getBots(b => b.tags.abIDOrigin == null && b.space === 'shared' && !b.tags.abIgnore);

shout("abSelectTitleUpdate", {ab: tags.label, abBots: totalPatternBots.length, nonABBots: nonPatternBots.length});

links.remember.masks.baseAB = tags.label == "new pattern" ? null : tags.label;

configBot.tags.selectedAB = tags.label == "new pattern" ? null : tags.label;

shout("studioCatalogPatternSelectMenuRefresh");

configBot.masks.menuPortal = "studioCalatogPublishMenu";`;

allPatterns.sort();

for (let i = 0; i < allPatterns.length; i++)
{
    let activePatternName = allPatterns[i];

    menuButton.formAddress = targetAB == activePatternName ? "radio_button_checked" : "radio_button_unchecked";
    menuButton.label = activePatternName;

    if (activePatternName == "new pattern")
    {
        menuButton.studioCatalogPatternSelectMenuSortOrder = -1;
    }
    else
    {
        menuButton.studioCatalogPatternSelectMenuSortOrder = i;
    }

    ab.links.menu.abCreateMenuButton(menuButton);
}

if (!getBot(byMod({studioCatalogPatternSelectMenu: true, formAddress: "radio_button_checked"})))
{
    const newBot = getBot(byMod({studioCatalogPatternSelectMenu: true, label: "new pattern"}));
    
    newBot.tags.formAddress = "radio_button_checked";
}