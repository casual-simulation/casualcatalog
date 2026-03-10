//useful dev commands
if (that.message[0] == "@")
{
    let command = that.message.substring(1);

    os.hideChat();

    switch (command)
    {
        case "publish_eggCarton":
            configBot.tags.versionDefined = "stable";

            configBot.tags.selected_studioID = "62435408-dd5d-4856-a29c-ef4eb04f7fee";

            os.toast("eggCarton publish begun");
            
            await shout("abPublishAB", {ab: "eggCarton", publicFacing: true})[0];

            os.toast("eggCarton publish complete");

            break;
        default:
            os.toast("command not recognized");
    }
}