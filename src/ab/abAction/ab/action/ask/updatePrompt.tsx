shout("abMenuRefresh");

configBot.masks.menuPortal = "abMenu";

let promptMenuButton = {};

promptMenuButton.abMenu = true;
promptMenuButton.form = "input";
promptMenuButton.abMenuRefresh = "@ destroy(thisBot);";
promptMenuButton.manifestation = tags.manifestation;
promptMenuButton.remember = tags.remember;
promptMenuButton.gptBot = "🔗" + thisBot.id;

if (that == "load")
{
    promptMenuButton.label = "load prompt";
    promptMenuButton.formAddress = "cloud_download";
    promptMenuButton.onSubmit = "@ links.gptBot.loadPrompt(that.text);";
}
else
{
    promptMenuButton.label = "save prompt";
    promptMenuButton.formAddress = "backup";
    promptMenuButton.onSubmit = "@ links.gptBot.savePrompt(that.text);";
}

links.menu.abCreateMenuButton(promptMenuButton);

promptMenuButton.form = null;
promptMenuButton.label = "  ";
promptMenuButton.labelAlignment = "center";
promptMenuButton.color = "#f24727";
promptMenuButton.formAddress = "cancel";
promptMenuButton.onSubmit = null;
promptMenuButton.onClick = "@ links.gptBot.editPrompt();";

links.menu.abCreateMenuButton(promptMenuButton);