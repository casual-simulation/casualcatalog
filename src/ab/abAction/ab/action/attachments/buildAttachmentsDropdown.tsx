// Initial build of the attachments dropdown, called from each `{menuType}OnBeforeCreate`
// during menu construction. Writes options + label as masks on the skill bot so abOpenMenu
// picks them up when constructing the dropdown header.

const menuType: string = that.menuType;
const { options, label } = thisBot.getAttachmentsDropdownOptions();

setTagMask(thisBot, menuType + "Label", label);
masks.dropdownOptions = options;
