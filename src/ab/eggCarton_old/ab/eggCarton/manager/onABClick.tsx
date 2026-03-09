shout("cartonMenuReset");

const menuButton = {};

menuButton.manager = getLink(thisBot);
menuButton.formAddress = "tour";
menuButton.label = "take a tour";
menuButton.onClick = "@ links.manager.tourClick();";

thisBot.cartonButtonCreate(menuButton);

menuButton.formAddress = "school";
menuButton.label = "jump into a tutorial";
menuButton.onClick = "@ os.goToURL('https://ab1.bot/?ask=casualTutorial&gridPortal=home');";

thisBot.cartonButtonCreate(menuButton);

menuButton.formAddress = "cube";
menuButton.label = "start creating";
menuButton.onClick = "@ os.goToURL('https://ab1.bot');";

thisBot.cartonButtonCreate(menuButton);

menuButton.formAddress = "help";
menuButton.label = "contact help";
menuButton.onClick = "@ links.manager.help_click();";

thisBot.cartonButtonCreate(menuButton);

const auth = await os.requestAuthBotInBackground();
const permitCheck = auth ? await os.getData(auth.id, "ai_permit") : {success: false};

if (!permitCheck.success)
{
    menuButton.formAddress = "badge";
    menuButton.label = "request AI permit";
    menuButton.onClick = "@ links.manager.aiPermit_request()";

    thisBot.cartonButtonCreate(menuButton);
}