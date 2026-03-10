let additionalTags = that;
let newMenuButton = {};

newMenuButton.space = "tempLocal";
newMenuButton.cartonMenu = true;
newMenuButton.color = tags.baseButtonColor;
newMenuButton.labelColor = tags.baseLabelColor;
newMenuButton.labelAlignment = "left";
newMenuButton.menuItemStyle = { "border-radius":"8px", "margin-top":"3px"};
newMenuButton.cartonMenuReset = "@ destroy(thisBot);";

for (const tag in additionalTags)
{
    newMenuButton[tag] = additionalTags[tag];
}

let createdMenuButton = await create(newMenuButton);

return createdMenuButton;