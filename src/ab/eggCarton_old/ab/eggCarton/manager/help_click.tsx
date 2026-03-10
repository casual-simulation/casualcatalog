shout("cartonMenuReset");

const menuButton = {};

menuButton.manager = getLink(thisBot);
menuButton.label = "If you need any help or have questions, please reach out to Josh Freeney at the Grand Rapids Public Museum.";
menuButton.scaleY = "auto";
menuButton.menuItemStyle = {"border-radius":"8px 8px 0px 0px", "margin-top":"3px"};

thisBot.cartonButtonCreate(menuButton);

menuButton.formAddress = "content_copy";
menuButton.label = "Jfreeney@grpm.org";
menuButton.onClick = "@ os.setClipboard('Jfreeney@grpm.org'); os.toast('email copied to clipboard');";
menuButton.labelAlignment = "center";
menuButton.scaleY = 1;
menuButton.menuItemStyle = {"border-radius":"0px 0px 8px 8px", "margin-top":"0px"};

thisBot.cartonButtonCreate(menuButton);