shout("abMenuRefresh");

configBot.masks.menuPortal = "abMenu";

let promptMenuButton = {};

promptMenuButton.abMenu = true;
promptMenuButton.abMenuRefresh = "@ destroy(thisBot);";
promptMenuButton.manifestation = tags.manifestation;
promptMenuButton.remember = tags.remember;
promptMenuButton.gptBot = "🔗" + thisBot.id;
promptMenuButton.label = "load prompt";
promptMenuButton.formAddress = "cloud_download";
promptMenuButton.onClick = "@ links.gptBot.updatePrompt('load');";

links.menu.abCreateMenuButton(promptMenuButton);

promptMenuButton.label = "save prompt";
promptMenuButton.formAddress = "backup";
promptMenuButton.onClick = "@ links.gptBot.updatePrompt('save');";

links.menu.abCreateMenuButton(promptMenuButton);

masks.onGridClick = `@ configBot.masks.tagPortal = null;

tagPortalBot.masks.tagPortalAnchorPoint = null;
`;

tagPortalBot.masks.tagPortalAnchorPoint = "top";

configBot.masks.tagPortal = thisBot.id + ".prompt_core";

if (configBot.masks.tagPortalSpace)
{
    configBot.masks.tagPortalSpace = null;
}