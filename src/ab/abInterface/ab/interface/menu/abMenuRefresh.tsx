if (configBot.tags.menuPortal?.substring(0,2) == "ab")
{
    configBot.masks.menuPortal = null;
    configBot.tags.menuPortal = null;

    masks.onGridClick = null;
    masks.onKeyDown = null;
}