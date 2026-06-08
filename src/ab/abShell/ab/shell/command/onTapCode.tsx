const tapCode = that;

switch (tapCode)
{
    case "3342":
        os.toast("waking " + links.remember.tags.abBuilderIdentity);

        thisBot.onChat({message: ".."});
        break;
    case "4242":
        thisBot.abChatBarOpen();
        break;
    default:
        //console.log(tapCode);
}