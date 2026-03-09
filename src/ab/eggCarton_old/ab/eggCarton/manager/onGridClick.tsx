shout("cartonMenuReset");

if (tags.tourPoint != null)
{
    masks.tourPoint = null;

    const welcomeMessage = `Welcome to your Practice Permit!

    My name is ${abRemember.tags.abBuilderIdentity}, and I'm here to help you get started.

    Click on me to get a guided tour, or feel free to explore on your own.`

    shout("showConsole");

    ab.log(welcomeMessage);
}