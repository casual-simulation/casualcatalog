//shout("abMenuRefresh");

configBot.masks.menuPortal = "abStudioMenu";

links.menu.masks.onGridClick = "@ shout('abMenuRefresh'); links.manifestation.abClick();";

const studios = that.studios;
const targetStudio = configBot.tags.selected_studioID ? configBot.tags.selected_studioID : configBot.tags.studio ? configBot.tags.studio : authBot.id;
const menuButton = {};

menuButton.abStudioMenu = true;
menuButton.abMenuSortOrder = 0;
menuButton.abMenuRefresh = "@ destroy(thisBot);";
menuButton.abStudioMenuRefresh = "@ destroy(thisBot);";
menuButton.label = "player studio";
menuButton.formAddress = targetStudio == authBot.id ? "radio_button_checked" : "radio_button_unchecked";
menuButton.color = links.remember.tags.abBaseColor;
menuButton.manager = "🔗" + thisBot.id;
menuButton.studioID = authBot.id;
menuButton.onClick = `@ configBot.tags.selected_studioID = tags.studioID;

links.manager.links.studioSelectButton.tags.label = tags.label;

shout("abStudioMenuRefresh");

configBot.masks.menuPortal = "abMenu";`;

links.menu.abCreateMenuButton(menuButton);

for (let i = 0; i < studios.length; i++)
{
    let activeStudio = studios[i];

    menuButton.formAddress = targetStudio == activeStudio.studioId ? "radio_button_checked" : "radio_button_unchecked";
    menuButton.label = activeStudio.displayName;
    menuButton.studioID = activeStudio.studioId;

    links.menu.abCreateMenuButton(menuButton);
}