if (!tags.abAwake)
{
    return;
}

let abMenuButton = {};

abMenuButton.abMenu = true;
abMenuButton.remember = links.menu.tags.remember;
abMenuButton.manifestation = links.menu.tags.manifestation;
abMenuButton.abMenuRefresh = "@ destroy(thisBot);";
abMenuButton.baseSkill = "🔗" + links.ask.id;
abMenuButton.label = links.ask.tags.abCoreMenuLabel;
abMenuButton.formAddress = links.ask.tags.abCoreMenuIcon;
abMenuButton.onCreate = links.ask.tags.abCoreMenuOnGenerate;
abMenuButton.abMenuSortOrder = links.ask.tags.abCoreMenuSortOrder;
abMenuButton.color = links.ask.tags.abCoreMenuColor ? links.ask.tags.abCoreMenuColor : links.personality.tags.abBaseStrokeColor;

links.menu.abCreateMenuButton(abMenuButton);